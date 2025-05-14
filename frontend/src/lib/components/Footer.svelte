<script lang="ts">
	import Logo from './Logo.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="w-ful mx-auto border-t border-gray-400 px-5 py-6">
	<div class="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-5">
		<Logo />
		<p class="text-center">
			BPMNSmart es un proyecto desarrollado por Jhon Rivero, dedicado a proporcionar soluciones
			innovadoras y al alcance de todos en la creación de diagramas de flujo en línea.
		</p>
		<p>© {year} - BPMNSmart</p>
	</div>
</footer>
