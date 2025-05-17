<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormResult } from './types.js';

	let activeTab = $state('login');

	const { form }: { form: FormResult } = $props();
</script>

<section class="mx-auto flex max-w-sm flex-col items-center justify-center space-y-5 py-8">
	<div class="mx-auto w-full max-w-md p-4">
		<div class="mb-4 flex rounded-lg p-2">
			<button
				onclick={() => (activeTab = 'login')}
				class="flex-1 cursor-pointer rounded-l-lg border px-4 py-2 font-medium transition duration-500"
				class:bg-blue={activeTab === 'login'}
				class:text-white={activeTab === 'login'}
				class:border-bg-blue={activeTab === 'login'}
				class:bg-transparent={activeTab !== 'login'}
				class:text-letters={activeTab !== 'login'}
				class:border-zinc-300={activeTab !== 'login'}
				class:hover:bg-gray-200={activeTab !== 'login'}
			>
				Iniciar sesión
			</button>
			<button
				onclick={() => (activeTab = 'create')}
				class="flex-1 cursor-pointer rounded-r-lg border px-4 py-2 font-medium transition duration-500"
				class:bg-green-600={activeTab === 'create'}
				class:text-white={activeTab === 'create'}
				class:border-green-600={activeTab === 'create'}
				class:bg-transparent={activeTab !== 'create'}
				class:text-letters={activeTab !== 'create'}
				class:border-zinc-300={activeTab !== 'create'}
				class:hover:bg-gray-200={activeTab !== 'create'}
			>
				Crear cuenta
			</button>
		</div>

		<div class="rounded-2xl border border-gray-300 p-6 shadow-xl">
			<!-- Login Panel -->
			{#if activeTab === 'login'}
				<form method="POST" action="?/login" use:enhance class="space-y-6">
					<div class="space-y-2">
						<label for="emailLogin">Correo electrónico</label>
						<input
							type="email"
							name="emailLogin"
							id="emailLogin"
							placeholder="Inserte"
							value={form?.data?.emailLogin ?? ''}
							class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
						/>
						{#if form?.action === 'login' && form?.errors?.emailLogin}
							<p class="text-sm text-red-500">{form.errors.emailLogin[0]}</p>
						{/if}
					</div>
					<div class="space-y-2">
						<label for="passwordLogin">Contraseña</label>
						<input
							name="passwordLogin"
							id="passwordLogin"
							type="password"
							placeholder="Inserte"
							value={form?.data?.passwordLogin ?? ''}
							class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
						/>
						{#if form?.action === 'login' && form?.errors?.passwordLogin}
							<p class="text-sm text-red-500">{form.errors.passwordLogin[0]}</p>
						{/if}
					</div>
					<button
						type="submit"
						class="bg-blue hover:bg-blue/80 w-full cursor-pointer rounded-lg py-3 font-medium text-white transition duration-500"
					>
						Iniciar sesión
					</button>
				</form>
			{/if}

			<!-- Crear cuenta Panel -->
			{#if activeTab === 'create'}
				<form method="POST" action="?/create" use:enhance class="space-y-6">
					<div class="space-y-2">
						<label for="nameCreate">Nombre</label>
						<input
							type="text"
							name="nameCreate"
							id="nameCreate"
							placeholder="Inserte"
							value={form?.data?.nameCreate ?? ''}
							class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
						/>
						{#if form?.action === 'create' && form?.errors?.nameCreate}
							<p class="text-sm text-red-500">{form.errors.nameCreate[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="lastNameCreate">Apellido</label>
						<input
							type="text"
							name="lastNameCreate"
							id="lastNameCreate"
							placeholder="Inserte"
							value={form?.data?.lastNameCreate ?? ''}
							class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
						/>
						{#if form?.action === 'create' && form?.errors?.lastNameCreate}
							<p class="text-sm text-red-500">{form.errors.lastNameCreate[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="emailCreate">Email</label>
						<input
							type="email"
							name="emailCreate"
							id="emailCreate"
							placeholder="Inserte"
							value={form?.data?.emailCreate ?? ''}
							class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
						/>
						{#if form?.action === 'create' && form?.errors?.emailCreate}
							<p class="text-sm text-red-500">{form.errors.emailCreate[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="passwordCreate">Contraseña</label>
						<input
							type="password"
							name="passwordCreate"
							id="passwordCreate"
							placeholder="Inserte"
							value={form?.data?.passwordCreate ?? ''}
							class="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
						/>
						{#if form?.action === 'create' && form?.errors?.passwordCreate}
							<p class="text-sm text-red-500">{form.errors.passwordCreate[0]}</p>
						{/if}
					</div>

					<button
						type="submit"
						class="bg-green hover:bg-green/80 w-full cursor-pointer rounded-lg py-3 font-medium text-white transition duration-500"
					>
						Crear cuenta
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>
