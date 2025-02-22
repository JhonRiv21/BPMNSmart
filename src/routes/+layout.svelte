<script>
    import Header from '$lib/components/Header.svelte';
    import '../app.css'
</script>

<Header />
<div class="max-w-screen-2xl mx-auto">
    <slot />
</div>