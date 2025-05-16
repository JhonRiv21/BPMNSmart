<script lang="ts">
	import { enhance } from '$app/forms';
	import type { LoginFormResult, CreateFormResult} from './types.js';

  let activeTab = $state('login');

  const { form } = $props();

  const loginForm = form?.action === 'login' ? form as LoginFormResult : null;
  const createForm = form?.action === 'create' ? form as CreateFormResult : null;

  $effect(() => {
    if (form?.action === 'login') activeTab = 'login';
    if (form?.action === 'create') activeTab = 'create';
  })
</script>

<section class="flex justify-center mx-auto items-center flex-col py-8 max-w-sm space-y-5">
  <div class="w-full max-w-md mx-auto p-4">
    <div class="flex mb-4 p-2 rounded-lg">
      <button
        onclick={() => activeTab = 'login'}
        class="flex-1 font-medium px-4 py-2 rounded-l-lg transition duration-500 border cursor-pointer"
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
        onclick={() => activeTab = 'create'}
        class="flex-1 font-medium px-4 py-2 rounded-r-lg transition duration-500 border cursor-pointer"
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

    <div class="shadow-xl border border-gray-300 rounded-2xl p-6">
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
              value={loginForm?.data?.emailLogin ?? ''}
              class="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1"
            />
            {#if loginForm?.errors?.emailLogin}
              <p class="text-red-500 text-sm">{loginForm.errors.emailLogin[0]}</p>
            {/if}
          </div>
          <div class="space-y-2">
            <label for="passwordLogin">Contraseña</label>
            <input
              name="passwordLogin"
              id="passwordLogin"
              type="password"
              placeholder="Inserte"
             value={loginForm?.data?.passwordLogin ?? ''}
              class="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1"
            />
            {#if loginForm?.errors?.passwordLogin}
              <p class="text-red-500 text-sm">{loginForm.errors.passwordLogin[0]}</p>
            {/if}
          </div>
          <button
            type="submit"
            class="w-full bg-blue hover:bg-blue/80 text-white font-medium rounded-lg py-3 transition duration-500 cursor-pointer"
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
              value={createForm?.data?.nameCreate ?? ''}
              class="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1"
            />
            {#if createForm?.errors?.nameCreate}
              <p class="text-red-500 text-sm">{createForm.errors.nameCreate[0]}</p>
            {/if}
          </div>
          <div class="space-y-2">
            <label for="nameCreate">Apellido</label>
            <input
              type="text"
              name="lastNameCreate"
              id="lastNameCreate"
              placeholder="Inserte"
              class="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1"
              value={createForm?.data?.lastNameCreate ?? ''}
            />
            {#if createForm?.errors?.lastNameCreate}
              <p class="text-red-500 text-sm">{createForm.errors.lastNameCreate[0]}</p>
            {/if}
          </div>
          <div class="space-y-2">
            <label for="emailCreate">Email</label>
            <input
              type="email"
              name="emailCreate"
              id="emailCreate"
              placeholder="Inserte"
              value={createForm?.data?.emailCreate ?? ''}
              class="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1"
            />
            {#if createForm?.errors?.emailCreate}
              <p class="text-red-500 text-sm">{createForm.errors.emailCreate[0]}</p>
            {/if}
          </div>
          <div class="space-y-2">
            <label for="passwordCreate">Contraseña</label>
            <input
              name="passwordCreate"
              id="passwordCreate"
              type="password"
              placeholder="Inserte"
             value={createForm?.data?.passwordCreate ?? ''}
              class="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1"
            />
            {#if createForm?.errors?.passwordCreate}
              <p class="text-red-500 text-sm">{createForm.errors.passwordCreate[0]}</p>
            {/if}
          </div>
          <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg py-2 transition-colors"
          >
            Crear cuenta
          </button>
        </form>
      {/if}
    </div>
  </div>
</section>