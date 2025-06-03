<script lang="ts">
	import { onMount } from 'svelte';
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import Save from '$lib/assets/icons/Save.svelte';
	import {
		getDiagramById,
		updatedDiagram,
		updatedDiagramWithHistorical,
		getHistoricalProcess
	} from '$lib/services/Diagram';
	import { page } from '$app/state';
	import { toast } from 'store/toast';
	import defaultDiagram from '$lib/resources/defaultDiagram.bpmn?raw';
	import { debounce, sanitizeString } from '$lib/utils/utils';
	import type { Historical } from '$lib/types/process';
	import { timeSince } from '$lib/utils/utils';
	import { setupKeyboardShortcuts } from '$lib/functions/keyboardShortcuts';
	import { exportBpmnDiagram } from '$lib/functions/exportDiagram';
	import { generatePngScreenshot } from '$lib/functions/screenshotHandler';

	const currentIdDiagram = page.url.pathname.replace('/bpmn/', '');
	let modeler: BpmnModeler | null = null;
	let canvasContainerElement: HTMLDivElement | null = null;
	let otherOptions = $state<boolean>(false);

	let diagramName = $state('');
	let initialDiagramName = '';
	let isLoading = $state(true);
	let showVersionHistory = $state(false);
	let versionHistory = $state<Historical[]>([]);

	const exportDiagram = debounce(async () => {
		await exportBpmnDiagram(modeler, diagramName);
	}, 500);

	const takeScreenshot = async (): Promise<string> => {
		return await generatePngScreenshot(modeler);
	};

	const handleAutoSave = debounce(async () => {
		if (!modeler || isLoading) return;

		try {
			const { xml } = await modeler.saveXML({ format: true });
			const nameToSend = diagramName.trim() === '' ? initialDiagramName : diagramName.trim();
			const screenshot = await takeScreenshot();

			await updatedDiagram(currentIdDiagram, {
				name: nameToSend,
				bpmnXml: xml || '',
				screenShot: screenshot || ''
			});
		} catch (err) {
			console.error('Error en autoguardado:', err);
			toast.error('Error al guardar automáticamente el diagrama.');
		}
	}, 2000);

	async function handleUpdate() {
		if (!modeler || isLoading) {
			toast.info('El editor aún no está listo o está cargando.');
			return;
		}
		const { xml } = await modeler.saveXML({ format: true });
		const nameToSend = diagramName.trim() === '' ? initialDiagramName : diagramName.trim();

		if (nameToSend.trim() === '') {
			toast.error('El nombre del diagrama no puede estar vacío.');
			return;
		}

		const screenshot = await takeScreenshot();

		await updatedDiagramWithHistorical(currentIdDiagram, {
			name: nameToSend,
			bpmnXml: xml || '',
			screenShot: screenshot || ''
		});

		toast.success('Diagrama actualizado correctamente');

		if (nameToSend !== initialDiagramName) {
			initialDiagramName = nameToSend;
		}

		try {
			const history = await getHistoricalProcess(currentIdDiagram);
			versionHistory = history || [];
		} catch (e) {
			console.error('Error al cargar el historial del diagrama:', e);
		}
	}

	async function loadHistoricalVersion(xml: string) {
		if (!modeler) return toast.error('Modeler no inicializado');
		try {
			await modeler.importXML(xml);
			toast.success('Versión cargada correctamente');
		} catch (err) {
			console.error('Error al importar versión del historial:', err);
			toast.error('Error al cargar esta versión del historial.');
		}
	}

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		if (!canvasContainerElement) {
			toast.error(
				'Error crítico: No se pudo inicializar el área de dibujo, intente más tarde.',
				8000
			);
			isLoading = false;
			return;
		}

		try {
			isLoading = true;

			modeler = new BpmnModeler({
				container: canvasContainerElement
			});

			const diagramData = await getDiagramById(currentIdDiagram);

			if (!diagramData || !diagramData.id) {
				toast.error(`No se encontró el diagrama con ID: ${currentIdDiagram}.`, 8000);
				return;
			}

			diagramName = diagramData.name || 'Diagrama sin Título';
			initialDiagramName = diagramName;

			if (diagramData.bpmnXml && diagramData.bpmnXml.trim().length > 0) {
				await modeler.importXML(diagramData.bpmnXml);
			} else {
				await modeler.importXML(defaultDiagram);
			}

			try {
				const history = await getHistoricalProcess(currentIdDiagram);
				versionHistory = history || [];
			} catch (e) {
				console.error('Error al cargar el historial del diagrama:', e);
			}
		} catch (err: any) {
			console.error('Error al cargar el diagrama:', err);
			toast.error(
				'Ocurrió un error al cargar el diagrama. Intenta recargar la página o contacta soporte.',
				8000
			);
		} finally {
			isLoading = false;
		}

		if (modeler) {
			setTimeout(() => {
				const poweredBy = document.querySelector('.bjs-powered-by') as HTMLElement | null;
				if (poweredBy) poweredBy.style.display = 'none';
			}, 100);

			setupKeyboardShortcuts(modeler);

			modeler.on('commandStack.changed', function () {
				handleAutoSave();
			});
		}
	});
</script>

<div
	class="fixed top-24 left-0 h-full w-full overflow-x-auto border border-gray-300 bg-white"
	id="js-drop-zone"
>
	<div
		class="relative h-full min-h-[80vh] w-full min-w-[150vw] sm:min-h-full sm:min-w-full"
		id="js-canvas"
		bind:this={canvasContainerElement}
	>
		<div class="fixed right-2 bottom-2 z-30 space-y-2">
			<div>
				<div class="my-2 space-y-2">
					{#if showVersionHistory}
						<div
							class="flex max-h-60 flex-col space-y-1.5 overflow-y-auto rounded-md bg-gray-200 p-2"
						>
							{#if versionHistory && versionHistory.length > 0}
								{#each versionHistory as version, index (version.id)}
									<button
										class="cursor-pointer rounded-md px-3 py-2 text-left text-xs transition-colors duration-150
										hover:bg-gray-300 focus:ring-2 focus:ring-black focus:outline-none
										{index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}"
										onclick={() => loadHistoricalVersion(version.bpmnXml)}
									>
										Versión {index + 1}
										<br />
										{timeSince(version.updatedAt) || 'Desconocido'}
									</button>
								{/each}
							{:else}
								<p class="text-sm text-gray-600">No hay versiones disponibles</p>
							{/if}
						</div>
					{/if}
				</div>

				<button
					onclick={() => {
						showVersionHistory = !showVersionHistory;
						otherOptions = false;
					}}
					class="w-full cursor-pointer rounded-md bg-[#1A1A1A] p-1.5 text-sm text-white transition duration-500 hover:bg-[#1A1A1A]/90"
				>
					{showVersionHistory ? 'Ocultar historial de versiones' : 'Mostrar historial de versiones'}
				</button>

				<div class="my-2 space-y-2">
					{#if otherOptions}
						<div class="flex flex-col rounded-md bg-slate-100 p-2">
							<label for="diagramName" class="pb-0.5 text-sm">Nombre del diagrama</label>
							<input
								id="diagramName"
								bind:value={diagramName}
								oninput={(e: Event) => {
									const input = e.currentTarget as HTMLInputElement;
									diagramName = sanitizeString(input.value);
								}}
								class="rounded-md border bg-white/60 px-2 py-1.5"
							/>
						</div>
						<button
							onclick={exportDiagram}
							class="button-principal flex flex-row items-center gap-2 px-4!"
						>
							<Save /> Exportar diagrama
						</button>
					{/if}
				</div>
				<button
					onclick={() => {
						otherOptions = !otherOptions;
						showVersionHistory = false;
					}}
					class="w-full cursor-pointer rounded-md bg-gray-600 p-1.5 text-white transition duration-500 hover:bg-gray-500"
				>
					{otherOptions ? 'Ocultar opciones' : 'Mostrar más opciones'}
				</button>
			</div>
			<button
				onclick={handleUpdate}
				class="button-secondary flex w-full flex-row items-center gap-2 px-4!"
			>
				<Save /> Guardar diagrama
			</button>
		</div>
	</div>
</div>
