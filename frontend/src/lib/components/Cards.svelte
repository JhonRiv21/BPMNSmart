<script lang="ts">
	import Trash from '$lib/assets/icons/Trash.svelte';
	import Pencil from '$lib/assets/icons/Pencil.svelte';
	import { goto } from '$app/navigation';
	import { timeSince } from '$lib/utils/utils';

	type Props = {
		name: string;
		lastUpdated: string;
		trashAction: () => void;
		redirection: string;
		image: string
	};

	const { name, lastUpdated, trashAction, redirection, image }: Props = $props();
</script>

<div
	role="link"
	tabindex="0"
	ondblclick={() => goto(redirection)}
	onkeydown={(e) => {
		if (e.key === 'Enter') window.location.href = redirection;
	}}
	class="cursor-pointer rounded-lg border border-gray-500 shadow-lg"
>
	<div class="relative h-32 rounded-t-lg bg-white overflow-hidden">
		{#if image}
			<img
				src={image}
				alt={`${name} image`}
				class="absolute inset-0 h-full w-full object-cover"
			/>
		{/if}
		<button
			type="button"
			onclick={trashAction}
			class="absolute top-1 right-14 cursor-pointer rounded-md p-2 text-3xl transition duration-500 bg-red-50 hover:bg-red-200"
		>
			<Trash />
		</button>
		<button
			type="button"
			onclick={() => goto(redirection)}
			class="bg-blue-50 hover:bg-blue/20 absolute top-1 right-1 cursor-pointer rounded-md p-2 text-3xl transition duration-500"
		>
			<Pencil />
		</button>
	</div>
	<div class="bg-blue h-full} rounded-b-lg p-3">
		<p class="text-background max-w-[98%] truncate font-semibold">{name}</p>
		<p class="text-background max-w-[98%] truncate pt-1 text-xs">
			Última modificación: {timeSince(lastUpdated) || 'Desconocido'}
		</p>
	</div>
</div>
