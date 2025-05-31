<script lang="ts">
	import { onMount } from 'svelte';
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import defaultDiagram from '$lib/resources/defaultDiagram.bpmn?raw';
	import type CommandStack from 'diagram-js/lib/command/CommandStack';
	import Save from '$lib/assets/icons/Save.svelte'
	import { updatedDiagram } from '$lib/services/Diagram'
	import { page } from '$app/state'
	import { toast } from "store/toast";

	const currentIdDiagram = page.url.pathname.replace('/bpmn/', '');
	let modeler: BpmnModeler | null = null;
	let container: HTMLDivElement | null = null;
	let otherOptions = $state<boolean>(false);

	async function handleUpdate() {
		if (!modeler) return;

		const { xml } = await modeler.saveXML({ format: true });

		await updatedDiagram(currentIdDiagram, {
			name,
			bpmnXml: xml,
			screenShot: ""
		})
		
	}
		
	onMount(async () => {
		if (!container) return;

		modeler = new BpmnModeler({
			container: '#js-canvas'
		});

		await modeler.importXML(defaultDiagram);

		setTimeout(() => {
			const poweredBy = document.querySelector('.bjs-powered-by') as HTMLElement | null;
			if (poweredBy) poweredBy.style.display = 'none';
		}, 100);

		// Eventos de teclado
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
	});
</script>

<div
	class="fixed top-24 left-0 h-full w-full border border-gray-300 bg-white"
	id="js-drop-zone"
	bind:this={container}
>
	<div class="h-full w-full relative" id="js-canvas">
		<div class="fixed bottom-2 right-2 space-y-2 z-30">
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
					onclick={() => otherOptions = !otherOptions}
					class="text-white p-1.5 rounded-md bg-gray-600 w-full cursor-pointer hover:bg-gray-500 transition duration-500"
				>
					{otherOptions ? 'Ocultar opciones' : 'Mostrar más opciones'}
				</button>
			</div>
			<button
				onclick={handleUpdate}
				class="button-secondary flex flex-row items-center w-full gap-2 px-4!"
				>
				<Save /> Guardar diagrama
			</button>
		</div>
	</div>
</div>
