<script lang="ts">
	import { support } from '$lib';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let isOpen: boolean = $state(false);
	let message: string = $state('');
	let loading: boolean = $state(false);
	let success: boolean = $state(false);
	let error: string = $state('');

	function openModal() {
		isOpen = true;
	}

	function closeModal() {
		isOpen = false;
		message = '';
		success = false;
		error = '';
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		error = '';

		try {
			const formData = new FormData();
			formData.append('message', message);

			const response = await fetch('/support', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				success = true;
				message = '';
				setTimeout(() => {
					success = false;
				}, 3000);
			} else {
				error = result.error || 'Error al enviar el mensaje';
			}
		} catch {
			error = 'Error de conexión';
		} finally {
			loading = false;
			setTimeout(() => {
				isOpen = false;
			}, 2000);
		}
	}
</script>

<button class="fixed right-2 bottom-2 flex flex-col items-center" onclick={openModal}>
	<div
		class="max-w-12 cursor-pointer rounded-full border border-blue-500 bg-blue-100 p-2.5 transition duration-500 hover:bg-blue-200 sm:max-w-18"
	>
		<img src={support} alt="Soporte" />
	</div>
	<p class="text-blue pt-1 text-[8px] font-medium sm:text-xs">¿Necesitas soporte?</p>
</button>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div
			transition:fly={{ y: 20, duration: 300, easing: quintOut }}
			class="relative m-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
		>
			<button
				class="absolute top-4 right-5 cursor-pointer text-4xl text-gray-500 hover:text-red-500"
				onclick={closeModal}
			>
				&times;
			</button>

			<h2 class="mb-2 text-lg font-bold">¿En qué podemos ayudarte?</h2>
			<p class="mb-4 text-gray-600">
				Escribe tu problema o solicitud y te responderemos pronto vía email.
			</p>

			<form onsubmit={handleSubmit} class="space-y-4">
				<textarea
					name="message"
					bind:value={message}
					required
					placeholder="Escribe tu solicitud aquí..."
					class="h-32 w-full resize-none rounded-lg border p-3 focus:outline-blue-500"
				></textarea>

				<button type="submit" class="button-secondary ml-auto" disabled={loading}>
					{#if loading}
						Enviando...
					{:else}
						Enviar
					{/if}
				</button>

				{#if success}
					<p class="pt-2 text-sm text-green-600">✅ ¡Mensaje enviado correctamente!</p>
				{/if}

				{#if error}
					<p class="pt-2 text-sm text-red-600">❌ {error}</p>
				{/if}
			</form>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
