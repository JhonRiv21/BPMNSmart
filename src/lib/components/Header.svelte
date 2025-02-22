<script lang="ts">
    import Logo from "./Logo.svelte";
</script>

<header class="py-5 px-5 shadow-xl">
    <div class="flex flex-row justify-between items-center w-full max-w-screen-2xl mx-auto">
        <div>
            <Logo />
        </div>

        <div class="hidden sm:block flex-row items-center gap-4">
            <button class="px-5 py-2 hover:bg-gray-200 rounded-md">Crear cuenta</button>            
            <button class="px-5 py-2 text-white bg-primary rounded-md hover:bg-primary/90">Iniciar sesión</button>            
        </div>
    </div>
</header>