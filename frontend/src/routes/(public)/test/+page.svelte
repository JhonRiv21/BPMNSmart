<script lang="ts">
  import { enhance } from '$app/forms';

  const { form } = $props();
</script>

<form method="POST" use:enhance class="space-y-4">
  <div>
    <label>Username</label>
    <input
      class="border"
      name="username"
      value={form?.data?.username ?? ''}
    />
    {#if form?.errors?.username}
      <p class="text-red-500 text-sm">{form.errors.username[0]}</p>
    {/if}
  </div>

  <div>
    <label>Edad</label>
    <input
      class="border"
      name="age"
      value={form?.data?.age ?? ''}
    />
    {#if form?.errors?.age}
      <p class="text-red-500 text-sm">{form.errors.age[0]}</p>
    {/if}
  </div>

  {#if form?.errors?.general}
    <p class="text-red-500 text-sm">{form.errors.general[0]}</p>
  {/if}

  <button type="submit">Enviar</button>
</form>

{#if form?.success}
  <p class="text-green-600 mt-4">Formulario enviado correctamente ✅</p>
{/if}
