<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { logo } from '$lib/index';

	type Props = {
		hiddensm?: boolean;
		href?: string;
	};

	let cursorPointer = $state(false);

	const managementRedirections = () => {
		if (
			page.url.pathname === '/' ||
			page.url.pathname === '/login' ||
			page.url.pathname === '/demo'
		) {
			cursorPointer = true;
			goto('/');
		}
		cursorPointer = false;
	};

	const { hiddensm = true }: Props = $props();
</script>

<button
	onclick={managementRedirections}
	class="flex flex-row items-center gap-3 {page.url.pathname === '/' ||
	page.url.pathname === '/login' ||
	page.url.pathname === '/demo'
		? 'cursor-pointer'
		: ''}"
>
	<img class="w-18 min-w-18" src={logo} alt="Logo BPMNSmart" />
	<h3 class="text-letters {hiddensm ? 'hidden sm:block' : 'block'} text-4xl font-semibold">
		BPMNSmart
	</h3>
</button>
