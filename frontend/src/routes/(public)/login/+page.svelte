<script lang="ts">
  let activeTab = $state('login');
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
        <form class="space-y-8">
          <input
            type="email"
            placeholder="Email"
            class="w-full border border-zinc-300 rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            class="w-full border border-zinc-300 rounded-lg px-3 py-2"
          />
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
        <form class="space-y-8">
          <input
            type="text"
            placeholder="Nombre"
            class="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="Apellido"
            class="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            class="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            class="w-full border rounded-lg px-3 py-2"
          />
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