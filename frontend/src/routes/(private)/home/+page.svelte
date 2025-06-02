<script lang="ts">
	import { enhance } from '$app/forms';
	import Plus from '$lib/assets/icons/Plus.svelte';
	import Search from '$lib/assets/icons/Search.svelte';
	import Upload from '$lib/assets/icons/Upload.svelte';
	import Cards from '$lib/components/Cards.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { normalize } from '$lib/utils/utils';
	import { toast } from 'store/toast';
	import Support from '$lib/components/Support.svelte';

	const { data, form } = $props();

	let processes = $state(data.processes);

	let openModalCreate = $state<boolean>(false);
	let openModalImport = $state<boolean>(false);
	let openModalDelete = $state<boolean>(false);

	let idReferenced = $state<string | null>(null);

	let filterData = $derived([...processes]);
	let searchDiagram: string = $state('');

	let bpmnXmlToImport: string = $state('');
	let importFileError: string = $state('');
	let importFileName: string = $state('');

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

	function handleFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		importFileError = '';
		bpmnXmlToImport = '';
		importFileName = '';

		if (!file) {
			input.value = '';
			return;
		}

		if (!file.name.endsWith('.bpmn') && !file.name.endsWith('.xml')) {
			importFileError = 'Por favor selecciona un archivo .bpmn o .xml válido.';
			input.value = '';
			return;
		}

		importFileName = file.name;
		const reader = new FileReader();

		reader.onload = () => {
			const text = reader.result?.toString() ?? '';
			if (
				!(
					text.includes('<bpmn:definitions') ||
					text.includes('<bpmn2:definitions') ||
					text.includes('<definitions')
				)
			) {
				importFileError = 'El contenido del archivo no parece ser un BPMN válido.';
				bpmnXmlToImport = '';
				input.value = '';
				importFileName = '';
				return;
			}
			bpmnXmlToImport = text;
			importFileError = '';
		};

		reader.onerror = () => {
			importFileError = 'Error al leer el archivo.';
			bpmnXmlToImport = '';
			input.value = '';
			importFileName = '';
		};
		reader.readAsText(file);
	}

	function resetImportModal() {
		openModalImport = false;
		bpmnXmlToImport = '';
		importFileError = '';
		importFileName = '';
		const fileInput = document.getElementById('bpmnFileImportInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}
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
						image={item.screenShot}
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
	<form method="POST" action="?/import" enctype="multipart/form-data" use:enhance>
		<Modal
			title="Importación de diagrama"
			text="SOLO EN FORMATO XML/BPMN"
			textAction="Importar diagrama"
			onCancel={resetImportModal}
			submitButton={true}
		>
			<div class="space-y-2">
				<label for="nameDiagramImported">Nombre</label>
				<input
					type="text"
					name="nameDiagram"
					id="nameDiagramImported"
					value={form?.values?.nameCreate ?? ''}
					placeholder="Inserte"
					maxlength="30"
					class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
				/>
				{#if form?.errors?.nameCreate}
					<p class="mt-1 text-sm text-red-500">{form.errors.nameCreate[0]}</p>
				{/if}
			</div>

			<div class="mt-6 space-y-2">
				<label for="bpmnFileImportInput" class="block text-sm font-medium text-gray-700">
					Archivo XML/BPMN
				</label>

				<input
					id="bpmnFileImportInput"
					type="file"
					name="bpmnFile"
					accept=".xml,.bpmn"
					onchange={handleFile}
					class="block w-full text-sm text-gray-600
								transition-colors duration-200 file:mr-4
								file:cursor-pointer file:rounded-md
								file:border-0 file:bg-blue-600 file:px-4
								file:py-2 file:text-white file:hover:bg-blue-700"
				/>

				{#if importFileName && !importFileError}
					<p class="mt-1 block text-sm text-green-600 sm:hidden">
						Archivo: <span class="font-semibold">{importFileName}</span>
					</p>
				{/if}

				{#if importFileError}
					<p class="mt-1 text-sm text-red-500">{importFileError}</p>
				{/if}
			</div>

			<input type="hidden" name="bpmnXml" value={bpmnXmlToImport} />
		</Modal>
	</form>
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

<Support />
