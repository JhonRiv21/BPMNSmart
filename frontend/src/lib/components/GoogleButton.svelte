<script lang="ts">
	import Google from '$lib/assets/icons/Google.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { isMaintenance } from 'store/maintenance';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let showLoading = false;
	let loadingMessage = 'Conectando con el servidor...';

	const messages = [
		'Conectando con el servidor...',
		'Reestableciendo conexión...',
		'Despertando la base de datos...',
		'Iniciando sesión segura...',
		'Casi listo...'
	];

	let messageIndex = 0;
	let intervalId: ReturnType<typeof setInterval> | null = null;

	async function loginWithGoogle() {
		showLoading = true;
		loadingMessage = messages[0];
		startMessageRotation();

		try {
			const res = await fetch('/api/awaken');
			await new Promise(r => setTimeout(r, 300));

			if (!res.ok) throw new Error('Servidor no responde');
			stopMessageRotation();
			window.location.href = `${PUBLIC_API_URL}/auth/google`;
		} catch (e) {
			alert('Error conectando con el servidor. Intenta de nuevo.');
			stopMessageRotation();
			showLoading = false;
		}
	}

	function startMessageRotation() {
		messageIndex = 0;
		intervalId = setInterval(() => {
			messageIndex = (messageIndex + 1) % messages.length;
			loadingMessage = messages[messageIndex];
		}, 4000);
	}

	function stopMessageRotation() {
		if (intervalId) clearInterval(intervalId);
		intervalId = null;
	}
</script>

{#if !$isMaintenance}
	<button
		on:click={loginWithGoogle}
		class="bg-blue hover:bg-blue/80 flex w-full cursor-pointer flex-row items-center gap-2 rounded-sm p-1 text-white transition duration-500"
	>
		<div class="bg-white p-1 sm:p-2">
			<Google />
		</div>
		<span class="mx-auto px-1 text-center sm:px-4 sm:text-lg">Ingresa con Google</span>
	</button>
{:else}
	<div
		class="bg-gray-400 w-full text-center px-5 sm:text-lg py-2.5 cursor-not-allowed rounded-sm text-black"
	>
		Ingreso deshabilitado
	</div>
{/if}

{#if showLoading}
	<div transition:fade class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="rounded-lg bg-white px-8 py-6 shadow-2xl text-center w-[90%] max-w-md sm:max-w-lg">
			<div class="mb-6 animate-pulse text-xl font-semibold text-gray-700 sm:text-2xl">
				{loadingMessage}
			</div>
			<div class="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
				<div class="h-full w-1/3 animate-loading-bar bg-blue-500"></div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes loading-bar {
		0% {
			margin-left: 0%;
		}
		100% {
			margin-left: 100%;
		}
	}

	.animate-loading-bar {
		animation: loading-bar 1.2s infinite linear;
	}
</style>
