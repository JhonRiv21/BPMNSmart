<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	import Google from '$lib/assets/icons/Google.svelte';
</script>

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
