<script lang="ts">
	import { toast } from 'store/toast';
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
	let currentToast;

	let unsubscribe;

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
	<div class="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
		<div
			transition:slide
			class={`relative pointer-events-auto w-[95%] sm:w-[300px] rounded-xs shadow-xl text-white ${toastBgClass}`}
			style="font-family: 'Inter', sans-serif;"
		>
			<button
				class="absolute top-3.5 right-2 text-white text-3xl opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
				onclick={() => toast.close()}
				aria-label="Cerrar notificación"
			>
				&times;
			</button>

			<div class="px-5 py-5 pr-12 text-lg font-medium tracking-wide">
				{currentToast.title}
			</div>

			<div
				class={`absolute bottom-0 left-0 w-full h-1.5 rounded-b overflow-hidden ${toastBarBgClass}`}
			>
				<div
					class={`h-full transition-[width] duration-100 linear ${toastBarClass}`}
					style={`width: ${currentToast.progress}%`}
				></div>
			</div>
		</div>
	</div>
{/if}
