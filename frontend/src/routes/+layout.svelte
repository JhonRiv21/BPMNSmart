<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<Header />
<section class="mx-auto max-w-screen-2xl">
	{@render children()}
</section>
