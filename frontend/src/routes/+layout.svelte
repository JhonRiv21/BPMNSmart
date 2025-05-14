<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<Header />
<section class="max-w-screen-2xl mx-auto">
	{@render children()}
</section>
