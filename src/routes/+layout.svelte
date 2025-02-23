<script>
    import Header from '$lib/components/Header.svelte';
    import '../app.css'
    import { page } from '$app/state';
</script>

<Header redirection={page.url.pathname.includes('/private') ? '/home' : '/'} />
<div class="max-w-screen-2xl mx-auto">
    <slot />
</div>