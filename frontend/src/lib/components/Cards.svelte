<script lang="ts">
	import Trash from '$lib/assets/icons/Trash.svelte';
	import Pencil from '$lib/assets/icons/Pencil.svelte';
	import { goto } from '$app/navigation';

	type Props = {
		name: string;
		lastUpdated: string;
		trashAction: () => void;
		redirection: string;
	};

	const { name, lastUpdated, trashAction, redirection }: Props = $props();
</script>

<div
	role="link"
	tabindex="0"
	ondblclick={() => goto(redirection)}
	onkeydown={(e) => {
		if (e.key === 'Enter') window.location.href = redirection;
	}}
	class="cursor-pointer rounded-lg border"
>
	<div class="relative h-32 rounded-t-lg bg-gray-200">
		<button
			type="button"
			onclick={trashAction}
			class="absolute top-1 right-12 cursor-pointer rounded-md p-2 text-3xl transition duration-500 hover:bg-red-200"
			><Trash /></button
		>
		<button
			type="button"
			onclick={() => goto(redirection)}
			class="hover:bg-blue/20 absolute top-1 right-1 cursor-pointer rounded-md p-2 text-3xl transition duration-500"
			><Pencil /></button
		>
	</div>
	<div class="bg-blue rounded-b-lg p-3">
		<p class="text-background font-semibold">{name}</p>
		<p class="text-background">{lastUpdated}</p>
	</div>
</div>
