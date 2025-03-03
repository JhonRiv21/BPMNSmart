<script lang="ts">

    const { isOpen, text } = $props();

</script>

{#if isOpen}
    <div class="fixed top-[6%] mx-auto left-[40%] border-2 border-primary bg-green-600 text-white py-5 px-12 rounded-md shadow-xl">
        <h5 class="text-xl">{text}</h5>
    </div>
{/if}