<script lang="ts">
    import Logo from "./Logo.svelte";
    import { page } from "$app/state";
</script>

<header class="py-5 px-5 shadow-xl">
    <div class="flex flex-row justify-between items-center w-full max-w-screen-2xl mx-auto">
        <a href={!page.url.pathname.includes('/public') ? '/home' : '/'}>
            <Logo />
        </a>

        {#if !page.url.pathname.includes('home') || !page.url.pathname.includes('diagram')}
            <div class="flex flex-row items-center gap-x-4">
                {#if page.url.pathname !== '/home'}
                    <a href="/home" aria-label="home" class="button hover:bg-primary/20 p-2.5 rounded-md">
                        <svg width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>
                    </a>
                {/if}            
                <button aria-label="logout" class="button bg-secondary/10 hover:bg-secondary/40 p-2.5 rounded-md">
                    <svg width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"/><path d="M9 12h12l-3-3m0 6l3-3"/></g></svg>
                </button>            
            </div>
        {:else}
            <div class="hidden sm:block flex-row items-center gap-4">
                <a href="/create-account" class="button px-5 mx-2 py-2.5 hover:bg-gray-200 rounded-md">Crear cuenta</a>            
                <a href="/login" class="button px-5 py-2.5 text-white bg-primary rounded-md hover:bg-primary/90">Iniciar sesión</a>            
            </div>
        {/if}
    </div>
</header>