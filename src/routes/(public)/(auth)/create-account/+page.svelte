<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<section>
    <div class="flex flex-col justify-center items-center h-full p-5 max-w-xs mx-auto">        
        <form method="POST" action="?/signup" use:enhance class="space-y-5 pt-5 w-full">
            <h5 class="text-2xl font-medium text-center">Crear cuenta</h5>
            <div class="border-b-2"></div>
            <div class="flex flex-col">
                <label for="email" class="text-lg">Correo electrónico:</label>
                <input id="email" name="email" required class="border px-2.5 py-2 rounded-md" placeholder="Inserte">
            </div>
            <div class="flex flex-col">
                <label for="password" class="text-lg">Contraseña:</label>
                <input id="password" name="password" type="password" required class="border px-2.5 py-2 rounded-md" placeholder="Inserte">
            </div>
            <div class="flex flex-col">
                <label for="confirm-password" class="text-lg">Confirmar contraseña:</label>
                <input id="confirm-password" name="confirm-password" type="password" required class="border px-2.5 py-2 rounded-md" placeholder="Inserte">
            </div>
            <div class="flex flex-col space-y-5">
                <button type="submit" class="button px-12 py-3 gap-2 font-semibold text-white bg-primary rounded-md hover:bg-primary/90">Crear cuenta</button>
            </div>
        </form>
    </div>
</section>