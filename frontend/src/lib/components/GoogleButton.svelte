<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	import Google from '$lib/assets/icons/Google.svelte';
	import { isMaintenance } from 'store/maintenance';
</script>

{#if !isMaintenance}
<a
	href={`${PUBLIC_API_URL}/auth/google`}
	data-sveltekit-reload
	class="bg-blue hover:bg-blue/80 flex w-full cursor-pointer flex-row items-center gap-2 rounded-sm p-1 text-white transition duration-500"
>
	<div class="bg-white p-1 sm:p-2">
		<Google />
	</div>
	<span class="mx-auto px-1 text-center sm:px-4 sm:text-lg"> Ingresa con google </span>
</a>
{:else}
	<div
		class="bg-gray-400 w-full text-center px-5 sm:text-lg py-2.5 cursor-not-allowed rounded-sm text-black"
	>
		Ingreso deshabilitado
	</div>
{/if}