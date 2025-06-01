<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import Toast from '$lib/components/Toast.svelte';

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
<section class="mx-auto h-full max-w-screen-2xl">
	{#if loading}
		<SkeletonLoader />
	{:else}
		{@render children()}
	{/if}
</section>
<Toast />
