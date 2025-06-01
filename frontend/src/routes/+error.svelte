<script>
	import { goto } from '$app/navigation';
</script>

<section class="flex h-full w-full flex-col items-center justify-center space-y-12 py-20 md:py-40">
	<h5 class="text-3xl">Página no encontrada</h5>
	<button
		type="button"
		onclick={() => goto('/home')}
		class="bg-green hover:bg-green/80 cursor-pointer rounded-lg px-12 py-3 font-medium text-white transition duration-500"
	>
		Volver al inicio
	</button>
</section>
