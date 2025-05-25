<script lang="ts">
	import Logo from './Logo.svelte';
	import { page } from '$app/state';
	import Home from '$lib/assets/icons/Home.svelte';
	import Logout from '$lib/assets/icons/Logout.svelte';
	import Modal from './Modal.svelte';
	import GoogleButton from './GoogleButton.svelte';

	let openModalLogout = $state(false);
</script>

<header class="w-ful mx-auto px-5 py-3 shadow-md">
	<div class="mx-auto flex max-w-screen-2xl flex-row items-center justify-between gap-4">
		<Logo />
		<nav class="flex w-full max-w-max flex-row gap-4">
			{#if page.url.pathname.includes('demo') || page.url.pathname === '/'}
				<GoogleButton />
			{/if}

			{#if page.url.pathname.includes('/bpmn')}
				<a
					href="/home"
					class="text-background bg-blue hover:bg-blue/80 rounded-lg p-2.5 text-2xl transition duration-500"
					><Home /></a
				>
			{/if}
			{#if page.url.pathname === '/home' || page.url.pathname.includes('/bpmn')}
				<button
					type="button"
					onclick={() => openModalLogout = !openModalLogout}
					class="text-background bg-green hover:bg-green/80 cursor-pointer rounded-lg p-2.5 text-2xl transition duration-500"
				><Logout /></button
				>
				{#if openModalLogout}
					<form method="POST" action="/logout">
						<Modal
							title="¿Desea cerrar sesión?"
							text="Será redirigido a la pantalla de inicio de sesión"
							textAction="Cerrar sesión"
							submitButton={true}
							onCancel={() => (openModalLogout = false)}
						/>
					</form>
				{/if}
			{/if}
		</nav>
	</div>
</header>