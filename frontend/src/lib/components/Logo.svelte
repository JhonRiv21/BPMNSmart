<script lang="ts">
	import { logo } from '$lib/index';

	type Props = {
		hiddensm?: boolean;
		href?: string;
	};

	const { hiddensm = true, href = '/' }: Props = $props();
</script>

<a {href} class="flex flex-row items-center gap-3">
	<img class="w-18 min-w-18" src={logo} alt="Logo BPMNSmart" />
	<h3 class="text-letters {hiddensm ? 'hidden sm:block' : 'block'} text-4xl font-semibold">
		BPMNSmart
	</h3>
</a>
