<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import SkeletonLoader from '$lib/components/SkeletonLoader.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
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
{#key $page.url.pathname}
	<section
		in:fade={{ delay: 250, duration: 250 }}
		out:fade={{ duration: 250 }}
		class="mx-auto h-full max-w-screen-2xl"
	>
		{#if loading}
			<SkeletonLoader />
		{:else}
			{@render children()}
		{/if}
	</section>
{/key}
<Toast />
