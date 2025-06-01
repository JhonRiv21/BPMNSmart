<script lang="ts">
	import { onMount } from 'svelte';
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import type CommandStack from 'diagram-js/lib/command/CommandStack';
	import Save from '$lib/assets/icons/Save.svelte';
	import { getDiagramById, updatedDiagram } from '$lib/services/Diagram';
	import { page } from '$app/state';
	import { toast } from 'store/toast';
	import defaultDiagram from '$lib/resources/defaultDiagram.bpmn?raw';

	const currentIdDiagram = page.url.pathname.replace('/bpmn/', '');
	let modeler: BpmnModeler | null = null;
	let canvasContainerElement: HTMLDivElement | null = null;
	let otherOptions = $state<boolean>(false);

	let diagramName = $state('');
	let initialDiagramName = '';
	let isLoading = $state(true);

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

		await updatedDiagram(currentIdDiagram, {
			name: nameToSend,
			bpmnXml: xml || '',
			screenShot: ''
		});

		if (nameToSend !== initialDiagramName) {
			initialDiagramName = nameToSend;
		}
	}

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		if (!canvasContainerElement) {
			toast.error(
				'Error crítico: No se pudo inicializar el área de dibujo, intente más tarde.',
				10000
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

			if (diagramData.bpmnXml?.trim()) {
				await modeler.importXML(diagramData.bpmnXml);
			} else {
				await modeler.importXML(defaultDiagram);
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

			// Keyboard events
			let commandStack: CommandStack = modeler.get<CommandStack>('commandStack');

			window.addEventListener('keydown', (event) => {
				if (event.ctrlKey || event.metaKey) {
					switch (event.key) {
						case 'z':
							if (commandStack.canUndo()) {
								commandStack.undo();
							}
							break;
						case 'y':
							if (commandStack.canRedo()) {
								commandStack.redo();
							}
							break;
					}
				}
			});
		}
	});
</script>

<div class="fixed top-24 left-0 h-full w-full border border-gray-300 bg-white" id="js-drop-zone">
	<div class="relative h-full w-full" id="js-canvas" bind:this={canvasContainerElement}>
		<div class="fixed right-2 bottom-2 z-30 space-y-2">
			<div>
				<div class="my-2">
					{#if otherOptions}
						<button
							onclick={() => {}}
							class="button-principal flex flex-row items-center gap-2 px-4!"
						>
							<Save /> Exportar diagrama
						</button>
					{/if}
				</div>
				<button
					onclick={() => (otherOptions = !otherOptions)}
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
