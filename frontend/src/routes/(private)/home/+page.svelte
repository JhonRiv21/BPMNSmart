<script lang="ts">
	import Plus from '$lib/assets/icons/Plus.svelte';
	import Search from '$lib/assets/icons/Search.svelte';
	import Upload from '$lib/assets/icons/Upload.svelte';
	import Cards from '$lib/components/Cards.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { normalize } from '$lib/utils/utils';

	const dummy = [
		{
			id: '1',
			name: 'Nombre diagrama 1',
			lastTime: 'Úiltima edición: hace 20 minutos'
		},
		{
			id: '2',
			name: 'Nombre diagrama 2',
			lastTime: 'Úiltima edición: hace 20 minutos'
		}
	];

	let openModalCreate = $state(false);
	let openModalImport = $state(false);
	let openModalDelete = $state(false);

	let filterData = $state(dummy);
	let searchDiagram = $state('');

	const handleFilter = (searchItem: string) => {
		const search = normalize(searchItem);
		filterData = dummy.filter((item) => normalize(item.name).includes(search));
	};
</script>

<section class="p-5 md:p-10">
	<div class="flex flex-row items-center justify-between">
		<h5 class="text-xl">Directorio</h5>

		<div class="flex flex-row items-center gap-5">
			<button
				onclick={() => (openModalCreate = true)}
				class="button-principal flex flex-row items-center gap-2"
			>
				<Plus /> Crear diagrama
			</button>
			<button
				onclick={() => (openModalImport = true)}
				class="button-secondary flex flex-row items-center gap-2"
			>
				<Upload /> Importar diagrama
			</button>
		</div>
	</div>

	<section class="mt-10">
		{#if dummy.length > 0}
			<div class="relative mb-6 w-full">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
				/>
				<input
					bind:value={searchDiagram}
					oninput={() => handleFilter(searchDiagram)}
					class="w-full rounded-md border bg-white/60 py-2.5 pr-4 pl-10 focus:outline-none md:w-1/2 lg:w-1/5"
					placeholder="Buscar..."
				/>
			</div>
		{/if}

		{#if dummy.length === 0}
			<div class="mx-auto mt-30 w-full max-w-xl space-y-6">
				<h4 class="text-4xl">¡Bienvenido a BPMNSmart!</h4>
				<br />
				<h4 class="text-3xl">Aún no tienes diagramas creados.</h4>
				<p class="text-xl">
					Comienza tu primer diagrama BPMN para visualizar y estructurar tus procesos de forma
					clara.
				</p>
			</div>
		{:else if filterData.length === 0}
			<div class="mx-auto mt-10 w-full max-w-xl space-y-6">
				<h4 class="text-4xl">No se encontraron diagramas para los datos filtrados</h4>
			</div>
		{:else}
			<div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
				{#each filterData as item}
					<Cards
						name={item.name}
						lastUpdated={item.lastTime}
						redirection={`/bpmn/${item.id}`}
						trashAction={() => (openModalDelete = true)}
					/>
				{/each}
			</div>
		{/if}
	</section>
</section>

{#if openModalCreate}
	<Modal
		title="Creación de diagrama"
		text="Ingrese el nombre de su diagrama"
		textAction="Crear diagrama"
		onCancel={() => (openModalCreate = false)}
		onAction={() => (openModalCreate = false)}
	>
		<form>
			<div class="space-y-2">
				<label for="nameDiagram">Nombre</label>
				<input
					type="text"
					name="nameDiagram"
					id="nameDiagram"
					placeholder="Inserte"
					class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
				/>
			</div>
		</form>
	</Modal>
{/if}

{#if openModalImport}
	<Modal
		title="Importación de diagrama"
		text="SOLO EN FORMATO XML/BPMN"
		textAction="Crear diagrama"
		onCancel={() => (openModalImport = false)}
		onAction={() => (openModalImport = false)}
	>
		<form class="w-full">
			<div class="space-y-2">
				<label for="nameDiagramImported">Nombre</label>
				<input
					type="text"
					name="nameDiagramImported"
					id="nameDiagramImported"
					placeholder="Inserte"
					class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
				/>
			</div>

			<div class="mt-5 w-full rounded-md border border-gray-400 p-5">
				<div class="flex w-full flex-row items-center justify-between">
					<button class="button-secondary px-4! py-2! text-base!">Subir archivo</button>
					<p>Sin archivos seleccionados</p>
				</div>
			</div>
		</form>
	</Modal>
{/if}

{#if openModalDelete}
	<Modal
		title="¿Desea eliminar el diagrama?"
		text="Esta acción es irreversible"
		textAction="Eliminar diagrama"
		colorAction="green"
		onCancel={() => (openModalDelete = false)}
		onAction={() => (openModalDelete = false)}
	>
		<div></div>
	</Modal>
{/if}
