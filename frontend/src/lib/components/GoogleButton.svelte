<script>
	import { PUBLIC_API_URL } from "$env/static/public";
	import Google from "$lib/assets/icons/Google.svelte";
</script>

<a 
  href={`${PUBLIC_API_URL}/auth/google`} 
  data-sveltekit-reload 
  class="flex flex-row w-full items-center text-white bg-blue rounded-sm gap-2 p-1 cursor-pointer hover:bg-blue/80 transition duration-500"
>
  <div class="bg-white p-1 sm:p-2">
    <Google />
  </div>
  <span class="text-center sm:text-lg mx-auto px-1 sm:px-4">
    Ingresa con google
  </span>
</a>