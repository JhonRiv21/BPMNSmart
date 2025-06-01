<script lang="ts">
	import { enhance } from '$app/forms';
	import Plus from '$lib/assets/icons/Plus.svelte';
	import Search from '$lib/assets/icons/Search.svelte';
	import Upload from '$lib/assets/icons/Upload.svelte';
	import Cards from '$lib/components/Cards.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { normalize } from '$lib/utils/utils';
	import { toast } from 'store/toast';
	const { data, form } = $props();

	let processes = $state(data.processes);

	let openModalCreate = $state(false);
	let openModalImport = $state(false);
	let openModalDelete = $state(false);

	let idReferenced = $state<string | null>(null);

	let filterData = $state([...processes]);
	let searchDiagram = $state('');

	const handleFilter = (searchItem: string) => {
		const search = normalize(searchItem);
		if (!search) {
			filterData = [...processes];
		}
		filterData = processes.filter((item: { name: string }) =>
			normalize(item.name).includes(search)
		);
	};

	$effect(() => {
		handleFilter(searchDiagram);
	});

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<section class="p-5 md:p-10">
	<div class="flex flex-col items-center justify-between sm:flex-row">
		<h5 class="mr-auto text-xl">Directorio</h5>

		<div class="flex flex-wrap items-center gap-5 pt-5 sm:flex-row sm:pt-0">
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
		{#if processes.length > 0}
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

		{#if processes.length === 0}
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
			<div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each filterData as item (item.id)}
					<Cards
						name={item.name}
						lastUpdated={item.updatedAt}
						redirection={`/bpmn/${item.id}`}
						trashAction={() => {
							idReferenced = item.id;
							openModalDelete = true;
						}}
					/>
				{/each}
			</div>
		{/if}
	</section>
</section>

{#if openModalCreate}
	<form method="POST" action="?/create" use:enhance>
		<Modal
			title="Creación de diagrama"
			text="Ingrese el nombre de su diagrama (Max. 30 dígitos)"
			textAction="Crear diagrama"
			onCancel={() => (openModalCreate = false)}
			submitButton={true}
		>
			<div class="space-y-2">
				<label for="nameDiagram">Nombre</label>
				<input
					type="text"
					value={form?.values?.nameCreate ?? ''}
					name="nameDiagram"
					id="nameDiagram"
					placeholder="Inserte"
					maxlength="30"
					class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
				/>
				{#if form?.errors?.nameCreate}
					<p class="mt-1 text-sm text-red-500">{form.errors.nameCreate}</p>
				{/if}
			</div>
		</Modal>
	</form>
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
			<div class="w-full space-y-2">
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

{#if openModalDelete && idReferenced}
	<form
		method="POST"
		action="?/delete"
		use:enhance={() => {
			const currentIdDelete = idReferenced;

			return async ({ result }) => {
				if (result.type === 'success' && result.data?.success) {
					processes = processes.filter((p: { id: string | null }) => p.id !== currentIdDelete);
					openModalDelete = false;
					idReferenced = null;
					toast.success(String(result.data?.message));
				} else if (result.type === 'failure' || (result.type === 'success' && result.data?.error)) {
					openModalDelete = false;
					idReferenced = null;
					toast.error(String(result.data?.error));
				}
			};
		}}
	>
		<input type="hidden" id="idDelete" name="idDelete" value={idReferenced} />
		<Modal
			title="¿Desea eliminar el diagrama?"
			text="Esta acción es irreversible"
			textAction="Eliminar diagrama"
			colorAction="green"
			onCancel={() => {
				openModalDelete = false;
				idReferenced = null;
			}}
			submitButton={true}
		/>
	</form>
{/if}
