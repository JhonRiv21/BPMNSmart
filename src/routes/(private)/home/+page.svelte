<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import type { BPMNTypes } from "$lib/types/bpmn.js";
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";

    let { data } = $props();
    const dataBPMN: BPMNTypes[] =  $state(data.bpmn ?? []) 

    console.log("data", data.bpmn);

    let filteredDiagrams: BPMNTypes[] = $state(dataBPMN);
    let searchDiagram: string = $state("");
    let createDiagramOpen: boolean = $state(false);
    let importDiagramOpen: boolean = $state(false);
    let deleteDiagramOpen: boolean = $state(false);
    let selectedID: string = $state('')

    function filterDiagrams(searchItem: string) {
        if (!searchDiagram.trim()) {
            filteredDiagrams = dataBPMN;
            return;
        }

        filteredDiagrams = dataBPMN?.filter((item) =>
            item.name_diagram.toLowerCase().includes(searchItem.toLowerCase()),
        );
    }

    function importDiagram() {
        console.log("diagrama importado");
        importDiagramOpen = false;
    }

    $effect(() => {
        filterDiagrams(searchDiagram);
    });
    
    function openDeleteModal(id: string) {
        selectedID = id;
        deleteDiagramOpen = true;
    }
</script>

<section class="p-5 sm:p-10">
    <div class="flex flex-wrap justify-between items-center gap-5 w-full">
        <p class="text-2xl">Directorio</p>

        <div class="flex flex-wrap items-center gap-4">
            <button
                onclick={() => (createDiagramOpen = !createDiagramOpen)}
                class="button flex flex-row items-center gap-2 px-5 py-2.5 text-white bg-secondary hover:bg-secondary/90 rounded-md"
            >
                <span>
                    <svg width="20" height="20" viewBox="0 0 32 32"
                        ><path
                            fill="currentColor"
                            d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
                        /></svg
                    >
                </span>
                Crear diagrama
            </button>
            <button
                onclick={() => (importDiagramOpen = !importDiagramOpen)}
                class="button flex flex-row items-center gap-2 px-5 py-2.5 text-white bg-primary rounded-md hover:bg-primary/90"
            >
                <span>
                    <svg width="20" height="20" viewBox="0 0 24 24"
                        ><path
                            fill="currentColor"
                            d="M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1m-9.71 1.71a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42L13 12.59V3a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42Z"
                        /></svg
                    >
                </span>
                Importar diagrama
            </button>
        </div>
    </div>

    <div class="mt-10 w-1/4">
        <label class="">
            Buscar por nombre
            <input
                bind:value={searchDiagram}
                oninput={() => filterDiagrams(searchDiagram)}
                class="border block px-3 py-2 rounded-md w-full"
                placeholder="Ingrese"
            />
        </label>
    </div>

    {#if dataBPMN.length > 0}
        {#if dataBPMN.length > 0 && (dataBPMN.length > 0 || searchDiagram === "")}
            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-5 mt-10"
            >
                {#each filteredDiagrams as item}
                    <button ondblclick={() => goto(`/diagram/${item.id}`)}>
                        <div class="relative border rounded-t-lg">
                            <img
                                class="rounded-t-lg max-h-30 w-full h-full object-cover"
                                src="https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png"
                                alt="diagram"
                            />
                            <div
                                class="absolute top-1 right-1 flex flex-row items-center justify-end gap-1"
                            >
                                <span
                                    role="button"
                                    aria-pressed="false"
                                    tabindex="0"
                                    onclick={() => openDeleteModal(item.id)}
                                    onkeydown={(e) =>
                                        (e.key === "Enter" || e.key === " ") &&
                                        (deleteDiagramOpen =
                                            !deleteDiagramOpen)}
                                    class="text-red-600 cursor-pointer transition duration-500 hover:bg-red-100 p-1.5 rounded-md"
                                >
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                                        />
                                    </svg>
                                </span>
                                <a
                                    aria-label="edit"
                                    href={`/diagram/${item.id}`}
                                    class="text-secondary transition duration-500 hover:bg-secondary/20 p-1.5 rounded-md"
                                    ><svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 24 24"
                                        ><path
                                            fill="currentColor"
                                            d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
                                        /></svg
                                    ></a
                                >
                            </div>
                        </div>
                        <div class="bg-secondary rounded-b-lg p-3 text-left">
                            <p class="text-white font-medium line-clamp-1">
                                {item.name_diagram}
                            </p>
                            <p class="text-white text-sm line-clamp-1">
                                {item.created_at}
                            </p>
                        </div>
                    </button>
                {/each}
            </div>
        {:else}
            <div class="mx-auto max-w-md mt-32 space-y-5 text-center">
                <h4 class="text-2xl sm:text-4xl font-medium">
                    No se encontraron diagramas por los datos filtrados
                </h4>
                <p>Realice la búsqueda nuevamente</p>
            </div>
        {/if}
    {:else}
        <div class="mx-auto max-w-md mt-32 space-y-5 text-center">
            <h4 class="text-2xl sm:text-4xl font-medium">
                ¡Bienvenido a BPMNSmart!
            </h4>
            <p>Empieza ahora a crear tu primer diagrama, es fácil y rápido.</p>
        </div>
    {/if}
</section>

<Modal title="Creación de diagrama" isOpen={createDiagramOpen}>
    <form method="POST" use:enhance action="?/createDiagram">
        <label>
            Escriba el nombre del diagrama
            <input
                required
                id="name_diagram"
                name="name_diagram"
                class="border p-2 rounded-md w-full"
                placeholder="Escribir"
            />
        </label>
        <div class="pt-8 sm:flex sm:flex-row justify-end">
            <button
                onclick={() => (createDiagramOpen = false)}
                type="button"
                class="button px-5 mx-2 py-2 text-white bg-red-700 hover:bg-red-600 rounded-md"
                >Cancelar</button
            >
            <button
                type="submit"
                class="button px-5 py-2 text-white bg-secondary rounded-md hover:bg-secondary/90"
                >Crear diagrama</button
            >
        </div>
    </form>
</Modal>

<Modal title="Importar diagrama" isOpen={importDiagramOpen}>
    <form onsubmit={importDiagram}>
        <h4 class="text-red-700 font-medium text-lg">
            SOLO EN FORMATO XML/BPMN
        </h4>
        <div class="border flex flex-row rounded-md gap-5 p-2 mt-2">
            <button
                type="button"
                class="button w-full flex flex-row items-center gap-2 px-5 py-2 text-white bg-secondary hover:bg-secondary/90 rounded-md"
            >
                <span>
                    <svg width="20" height="20" viewBox="0 0 32 32"
                        ><path
                            fill="currentColor"
                            d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
                        /></svg
                    >
                </span>
                Subir archivo
            </button>
            <div class="w-full text-center">
                <p class="text-sm max-w-max">Sin archivos seleccionados</p>
            </div>
        </div>
        <div class="pt-8 sm:flex sm:flex-row justify-end">
            <button
                onclick={() => (importDiagramOpen = false)}
                type="button"
                class="button px-5 mx-2 py-2 text-white bg-red-700 hover:bg-red-600 rounded-md"
                >Cancelar</button
            >
            <button
                type="submit"
                class="button px-5 py-2 text-white bg-secondary rounded-md hover:bg-secondary/90"
                >Importar diagrama</button
            >
        </div>
    </form>
</Modal>

<Modal title="Eliminar diagrama" isOpen={deleteDiagramOpen}>
    <form method="POST" use:enhance action="?/deleteDiagram">
        <p class="text-xl">
            ¿Está seguro de realizar la eliminación del diagrama?
        </p>
        <p class="text-xl font-medium text-red-700 pt-5">
            Esta acción es irreversible
        </p>
        <input hidden name="id" bind:value={selectedID}>
        <div class="pt-8 sm:flex sm:flex-row justify-end">
            <button
                onclick={() => (deleteDiagramOpen = false)}
                type="button"
                class="button px-5 mx-2 py-2 text-white bg-secondary hover:bg-secondary/90 rounded-md"
                >Cancelar</button
            >
            <button
                type="submit"
                class="button px-5 py-2 text-white bg-red-700 hover:bg-red-600 rounded-md"
                >Eliminar diagrama</button
            >
        </div>
    </form>
</Modal>
