<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<section>
    <div class="flex flex-col justify-center items-center h-full p-5 max-w-xs mx-auto">        
        <form method="POST" action="?/login" use:enhance class="space-y-5 pt-5">
            <h5 class="text-2xl font-medium text-center">Iniciar sesión</h5>
            <div class="border-b-2"></div>
            <div class="flex flex-col">
                <label for="email" class="text-lg">Correo electrónico:</label>
                <input id="email" name="email" required class="border px-2.5 py-2 rounded-md" placeholder="Inserte">
            </div>
            <div class="flex flex-col">
                <label for="password" class="text-lg">Contraseña:</label>
                <input id="password" name="password" type="password" required class="border px-2.5 py-2 rounded-md" placeholder="Inserte">
            </div>
            <div class="flex flex-col space-y-5">
                <button type="submit" class="button px-12 py-3 gap-2 font-semibold text-white bg-primary rounded-md hover:bg-primary/90">Iniciar sesión</button>
                <div class="border-b-2"></div>
                <button type="button" class="button flex flex-row items-center rounded-sm p-0.5 gap-2 font-semibold text-white bg-blue-600 hover:bg-blue-600/90">
                    <span class="bg-white rounded-l-sm p-0.5">
                        <svg width="42" height="42" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/></svg>
                    </span>
                    <span class="mx-auto">
                        Inicia sesión con Google
                    </span>
                </button>
                <button type="button" class="hover:underline">¿Olvidaste tu contraseña?</button>
                <div class="text-center">¿Aún no tienes cuenta en BPMNSmart? <a class="md:px-5 py-2.5 text-primary font-medium" href="/create-account">¡Créala aquí!</a></div>
            </div>
        </form>
    </div>
</section>