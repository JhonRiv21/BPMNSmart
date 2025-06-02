<script lang="ts">
	import type { Unsubscriber } from 'svelte/store';
	import { toast, type ToastState } from 'store/toast';
	import { slide } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	const colors = {
		success: { bg: 'bg-green-600', bar: 'bg-green-700', barBg: 'bg-green-800' },
		error: { bg: 'bg-red-600', bar: 'bg-red-700', barBg: 'bg-red-800' },
		warning: { bg: 'bg-yellow-500', bar: 'bg-yellow-600', barBg: 'bg-yellow-700' },
		info: { bg: 'bg-blue-600', bar: 'bg-blue-700', barBg: 'bg-blue-800' }
	};

	let toastBgClass = colors.info.bg;
	let toastBarClass = colors.info.bar;
	let toastBarBgClass = colors.info.barBg;
	let currentToast: ToastState;

	let unsubscribe: Unsubscriber;

	onMount(() => {
		unsubscribe = toast.subscribe(($toast) => {
			currentToast = $toast;
			if ($toast.type && colors[$toast.type]) {
				toastBgClass = colors[$toast.type].bg;
				toastBarClass = colors[$toast.type].bar;
				toastBarBgClass = colors[$toast.type].barBg;
			} else {
				toastBgClass = colors.info.bg;
				toastBarClass = colors.info.bar;
				toastBarBgClass = colors.info.barBg;
			}
		});
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

{#if currentToast?.open}
	<div class="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center">
		<div
			transition:slide
			class={`font font-inter pointer-events-auto relative w-[95%] rounded-xs text-white shadow-xl sm:w-[350px] ${toastBgClass}`}
		>
			<button
				class="absolute top-3.5 right-2 cursor-pointer text-3xl text-white opacity-80 transition-opacity duration-200 hover:opacity-100"
				onclick={() => toast.close()}
				aria-label="Cerrar notificación"
			>
				&times;
			</button>

			<div class="px-5 py-5 pr-12 text-lg font-medium tracking-wide">
				{currentToast.title}
			</div>

			<div
				class={`absolute bottom-0 left-0 h-1.5 w-full overflow-hidden rounded-b ${toastBarBgClass}`}
			>
				<div
					class={`linear h-full transition-[width] duration-100 ${toastBarClass}`}
					style={`width: ${currentToast.progress}%`}
				></div>
			</div>
		</div>
	</div>
{/if}

<style>
	.font {
		font-family: 'Inter', sans-serif;
	}
</style>
