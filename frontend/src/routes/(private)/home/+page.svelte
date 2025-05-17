<script lang="ts">
	import Plus from '$lib/assets/icons/Plus.svelte';
	import Upload from '$lib/assets/icons/Upload.svelte';
	import Cards from '$lib/components/Cards.svelte';

	const dummy = [
		{
			id: '1',
			name: 'Nombre formulario',
			lastTime: 'Úiltima edición: hace 20 minutos'
		},
		{
			id: '2',
			name: 'Nombre formulario',
			lastTime: 'Úiltima edición: hace 20 minutos'
		}
	];
</script>

<section class="p-5 md:p-10">
	<div class="flex flex-row items-center justify-between">
		<h5 class="text-xl">Directorio</h5>

		<div class="flex flex-row items-center gap-5">
			<button class="button-principal flex flex-row items-center gap-2"
				><Plus /> Crear diagrama</button
			>
			<button class="button-secondary flex flex-row items-center gap-2"
				><Upload /> Importar diagrama</button
			>
		</div>
	</div>

	<section class="mt-20">
		{#if dummy.length > 0}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
				{#each dummy as item}
					<Cards
						name={item.name}
						lastUpdated={item.lastTime}
						redirection={`/bpmn/${item.id}`}
						trashAction={() => console.log('trash')}
					/>
				{/each}
			</div>
		{:else}
			<div class="mx-auto w-full max-w-xl space-y-6">
				<h4 class="text-4xl">¡Bienvenido a BPMNSmart!</h4>
				<br />
				<h4 class="text-3xl">Aún no tienes diagramas creados.</h4>
				<p class="text-xl">
					Comienza tu primer diagrama BPMN para visualizar y estructurar tus procesos de forma
					clara.
				</p>
			</div>
		{/if}
	</section>
</section>
