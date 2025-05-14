<script lang="ts">
  import Logo from './Logo.svelte';

  let menuOpen = $state(false);

</script>

<header class="px-5 py-6 max-w-screen-2xl w-full flex flex-row gap-4 justify-between items-center mx-auto shadow-md">
  <div class="w-full">
    <Logo />
  </div>

  <nav class="w-full max-w-max hidden md:flex flex-row gap-6">
    <a href="#s" class="px-8 py-2.5 text-lg hover:bg-gray-200 rounded-md transition duration-500">Crear cuenta</a>
    <a href="#s" class="button-principal">Ingresar</a>
  </nav>


</header>
