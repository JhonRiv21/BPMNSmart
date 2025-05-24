<script>
	import { goto } from "$app/navigation";

</script>
<section class="flex flex-col justify-center items-center py-20 md:py-40 h-full w-full space-y-12">
  <h5 class="text-3xl">Página no encontrada</h5>
  <button
    type="button"
    onclick={() => goto('/home')}
    class="bg-green hover:bg-green/80 cursor-pointer rounded-lg py-3 px-12 font-medium text-white transition duration-500"
  >
    Volver al inicio
  </button>
</section>