<script lang="ts">
	import { onMount } from 'svelte';
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import type CommandStack from 'diagram-js/lib/command/CommandStack';
	import Save from '$lib/assets/icons/Save.svelte';
	import { getDiagramById, updatedDiagram, updatedDiagramWithHistorical, getHistoricalProcess } from '$lib/services/Diagram';
	import { page } from '$app/state';
	import { toast } from 'store/toast';
	import defaultDiagram from '$lib/resources/defaultDiagram.bpmn?raw';
	import { debounce, sanitizeString } from '$lib/utils/utils';
	import type { Historical } from '$lib/types/process';
	import { timeSince } from '$lib/utils/utils';
	import { setupKeyboardShortcuts } from '$lib/functions/keyboardShortcuts';

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
		try {
			if (!modeler) return toast.error("No es posible exportar");
			const { xml } = await modeler.saveXML({ format: true });
			if (!xml) {
				return toast.error("El XML está vacío o no se pudo generar.");
			}
			const fileName = `bpmnsmart-${sanitizeString(diagramName || 'diagram')}.xml`;
			const blob = new Blob([xml], { type: 'application/xml' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			link.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Error al exportar diagrama: ", err);
			toast.error("No se pudo exportar el diagrama.");
		}
	}, 500);

	async function handleScreenshot(): Promise<string> {
		if (!modeler) return '';
		const svg = await modeler.saveSVG();
		const svgBlob = new Blob([svg.svg], { type: 'image/svg+xml;charset=utf-8' });

		return await new Promise<string>((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const svgDataUrl = reader.result as string;
				const image = new Image();
				image.onload = () => {
					const canvasElement = document.createElement('canvas');
					canvasElement.width = image.width;
					canvasElement.height = image.height;
					const ctx = canvasElement.getContext('2d');
					if (!ctx) return resolve('');
					ctx.drawImage(image, 0, 0);
					const pngDataUrl = canvasElement.toDataURL('image/png');
					resolve(pngDataUrl);
				};
				image.src = svgDataUrl;
			};
			reader.readAsDataURL(svgBlob);
		});
	}

	const handleAutoSave = debounce(async () => {
		if (!modeler || isLoading) return;

		try {
			const { xml } = await modeler.saveXML({ format: true });
			const nameToSend = diagramName.trim() === '' ? initialDiagramName : diagramName.trim();
			const screenshot = await handleScreenshot();

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

		const takeScreenShot = await handleScreenshot();

		await updatedDiagramWithHistorical(currentIdDiagram, {
			name: nameToSend,
			bpmnXml: xml || '',
			screenShot: takeScreenShot || ''
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

			modeler.on('commandStack.changed', function() {
				handleAutoSave();
			});
		}
	});
</script>

<div class="fixed top-24 left-0 h-full w-full border border-gray-300 bg-white" id="js-drop-zone">
	<div class="relative h-full w-full" id="js-canvas" bind:this={canvasContainerElement}>
		<div class="fixed right-2 bottom-2 z-30 space-y-2">
			<div>
				<div class="my-2 space-y-2">
					{#if showVersionHistory}
						<div class="flex flex-col bg-gray-200 p-2 rounded-md space-y-1.5 overflow-y-auto max-h-60">
							{#if versionHistory && versionHistory.length > 0}
								{#each versionHistory as version, index (version.id)}
									<button
										class="text-left cursor-pointer text-xs px-3 py-2 rounded-md transition-colors duration-150
										hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-black
										{index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}"
										onclick={() => loadHistoricalVersion(version.bpmnXml)}
									>
										Versión {index + 1}
										<br> 
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
					class="w-full text-sm cursor-pointer rounded-md bg-[#1A1A1A] p-1.5 text-white transition duration-500 hover:bg-[#1A1A1A]/90"
				>
					{showVersionHistory ? 'Ocultar historial de versiones' : 'Mostrar historial de versiones'}
				</button>
				
				<div class="my-2 space-y-2">
					{#if otherOptions}
						<div class="flex flex-col bg-slate-100 p-2 rounded-md">
							<label for="diagramName" class="text-sm pb-0.5">Nombre del diagrama</label>
							<input
							 	id="diagramName"
								bind:value={diagramName}
							  oninput={(e: Event) => {
									const input = e.currentTarget as HTMLInputElement;
									diagramName = sanitizeString(input.value);
								}}
							  class="border bg-white/60 py-1.5 px-2 rounded-md" />
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
						otherOptions = !otherOptions
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
