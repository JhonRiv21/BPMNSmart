<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';

	let loading = $state(false);
	let { children } = $props();

	beforeNavigate(() => {
		loading = true;
	});

	afterNavigate(() => {
		loading = false;
	});
</script>

<Header />
<section class="mx-auto max-w-screen-2xl">
	{#if loading}
		<SkeletonLoader />
	{:else}
		{@render children()}
	{/if}
</section>
