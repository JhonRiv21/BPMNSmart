<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<header class="w-ful mx-auto px-5 py-3 shadow-md">
	<div class="mx-auto flex max-w-screen-2xl flex-row items-center justify-between gap-4">
		<div class="w-full">
			<Logo />
		</div>

		<nav class="flex w-full max-w-max flex-row gap-6">
			<a href="/login" class="button-principal">Ingresar</a>
		</nav>
	</div>
</header>
