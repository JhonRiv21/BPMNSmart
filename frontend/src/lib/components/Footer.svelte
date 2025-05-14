<script lang="ts">
	import Logo from "./Logo.svelte";

  const year = new Date().getFullYear();
</script>

<footer class="px-5 py-6 w-ful mx-auto border-t border-gray-400">
  <div class="space-y-5 flex flex-col justify-center items-center max-w-2xl mx-auto">
    <Logo />
    <p class="text-center">
      BPMNSmart es un proyecto desarrollado por Jhon Rivero, dedicado a proporcionar 
      soluciones innovadoras y al alcance de todos en la creación de diagramas de flujo en línea.
    </p>
    <p>© {year} - BPMNSmart</p>
  </div>
</footer>