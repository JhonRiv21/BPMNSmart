<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
    import {
        Section1Landing,
        Section2Landing,
        Section3Landing,
        Section4Landing,
    } from "$lib/index";
    import { dataBenefits, questions } from "./datastatic";

    let questionExpanded: any = null;

    function toogleExpanded(index: any) {
        questionExpanded = questionExpanded === index ? null : index;
    }
</script>

<section class="grid lg:grid-cols-2 items-center w-full">
    <div class="space-y-10 w-full px-5 lg:px-8 py-20 lg:py-10">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Bienvenido a <span class="text-primary">BPMNSmart</span>
        </h1>
        <h4 class="text-lg sm:text-xl lg:text-2xl">
            Tu solución para <span class="text-primary"
                >modelado de procesos de negocio</span
            > ágil y eficiente.
        </h4>
        <h4 class="text-lg sm:text-xl lg:text-2xl">
            Diseña, personaliza y gestiona <span class="text-primary"
                >diagramas BPMN</span
            > para optimizar tus flujos de trabajo.
        </h4>
        <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold">
            ¡Totalmente Gratuito!
        </h3>
    </div>

    <div class="w-full h-full">
        <img
            class="w-full h-full"
            src={Section1Landing}
            alt="Persona oprimiendo formulario digital"
        />
    </div>
</section>

<section class="grid lg:grid-cols-2 items-center w-full">
    <div class="w-full order-last lg:order-first h-full">
        <img
            class="w-full h-full"
            src={Section2Landing}
            alt="Persona oprimiendo formulario digital"
        />
    </div>

    <div class="space-y-6 w-full px-5 lg:px-8 py-20 lg:py-10">
        <h4 class="text-xl sm:text-2xl lg:text-3xl">Beneficios:</h4>
        {#each dataBenefits as item}
            <div class="flex flex-row items-center gap-3">
                <span>
                    <svg width="30" height="30" viewBox="0 0 24 24"
                        ><path
                            fill="#237A36"
                            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10M8 10l-2 2l5 5l7-7l-2-2l-5 5z"
                        /></svg
                    >
                </span>
                <p class="text-sm sm:text-base lg:text-lg">{item.text}</p>
            </div>
        {/each}
    </div>
</section>

<section class="grid lg:grid-cols-2 items-center w-full">
    <div class="space-y-10 w-full px-5 lg:px-8 py-20 lg:py-10">
        <h2 class="text-3xl sm:text-4xl">
            ¿Quieres ver <span class="text-primary font-bold">BPMNSmart</span> en
            acción?
        </h2>
        <p class="sm:text-lg">
            Prueba nuestra demostración interactiva y descubre lo fácil que es
            crear diagramas personalizados.
        </p>
        <p class="sm:text-lg">¡Sin necesidad de registro!</p>

        <a 
            target="_blank"
            href="/demo"
            class="px-12 max-w-max py-3 gap-2 font-semibold text-white bg-primary rounded-md hover:bg-primary/90 mx-auto flex justify-center items-center"
        >
            <span>
                <svg width="20" height="20" viewBox="0 0 512 512"
                    ><path
                        fill="currentColor"
                        d="M459.15 269.75a133.197 133.197 0 0 1-55.862 179.975l-42.782 22.541l-10.52 5.533a71.28 71.28 0 0 1-62.966 1.685l-167.077-71.38l15.733-46.676l99.363 19.194l-51.458-97.78l-82.843-157.411l40.357-21.232l82.844 157.457l19.934-10.485l-36.521-69.445l40.335-21.22l36.52 69.445l19.935-10.485l-28.2-53.598l40.358-21.232l28.2 53.598l19.945-10.576l-19.354-36.886l40.346-21.174l19.354 36.885l54.348 103.301zM73.268 146.674a60.03 60.03 0 0 1 42.361-102.459a60.098 60.098 0 0 1 56.58 80.169l10.588 20.013A78.29 78.29 0 0 0 115.708 26a78.233 78.233 0 0 0-5.635 156.262L99.428 162.02a59.7 59.7 0 0 1-26.16-15.346"
                    /></svg
                >
            </span>
            ¡Prueba ahora!
        </a>
    </div>

    <div class="w-full h-full">
        <img
            class="w-full h-full"
            src={Section3Landing}
            alt="Persona oprimiendo formulario digital"
        />
    </div>
</section>

<section class="grid lg:grid-cols-2 items-center w-full">
    <div class="w-full order-last lg:order-first h-full">
        <img
            class="w-full h-full"
            src={Section4Landing}
            alt="Persona oprimiendo formulario digital"
        />
    </div>

    <div class="space-y-10 w-full px-5 lg:px-8 py-20 lg:py-10">
        <h2 class="text-3xl sm:text-4xl">
            ¿Listo para llevar tus <span class="text-primary font-bold"
                >diagramas de flujo</span
            > al siguiente nivel?
        </h2>
        <p class="sm:text-lg">
            Únete a <span class="text-primary font-bold">BPMNSmart:</span>
            Diseña, gestiona y optimiza tus procesos de negocio con
            <span class="text-primary">total seguridad.</span>
            Nuestra plataforma ofrece
            <span class="text-primary"
                >flexibilidad, facilidad de uso y control avanzado de versiones.</span
            >
        </p>

        <button
            class="px-12 py-3 gap-2 font-semibold text-white bg-primary rounded-md hover:bg-primary/90 mx-auto flex justify-center items-center"
        >
            <span>
                <svg width="20" height="20" viewBox="0 0 512 512"
                    ><path
                        fill="currentColor"
                        d="M459.15 269.75a133.197 133.197 0 0 1-55.862 179.975l-42.782 22.541l-10.52 5.533a71.28 71.28 0 0 1-62.966 1.685l-167.077-71.38l15.733-46.676l99.363 19.194l-51.458-97.78l-82.843-157.411l40.357-21.232l82.844 157.457l19.934-10.485l-36.521-69.445l40.335-21.22l36.52 69.445l19.935-10.485l-28.2-53.598l40.358-21.232l28.2 53.598l19.945-10.576l-19.354-36.886l40.346-21.174l19.354 36.885l54.348 103.301zM73.268 146.674a60.03 60.03 0 0 1 42.361-102.459a60.098 60.098 0 0 1 56.58 80.169l10.588 20.013A78.29 78.29 0 0 0 115.708 26a78.233 78.233 0 0 0-5.635 156.262L99.428 162.02a59.7 59.7 0 0 1-26.16-15.346"
                    /></svg
                >
            </span>
            Registrarse ahora
        </button>
    </div>
</section>

<hr class="my-10" />

<section
    class="grid lg:grid-cols-2 w-full items-center lg:items-start px-5 lg:px-8 py-10"
>
    <div class="w-full">
        <h2 class="text-3xl sm:text-4xl font-semibold">Preguntas Frecuentes</h2>
    </div>

    <div class="w-full space-y-5 pt-8 lg:pt-0">
        {#each questions as item, index}
            <button
                onclick={() => toogleExpanded(index)}
                class="flex flex-row items-center px-4 py-2.5 rounded-xl border gap-4 w-full"
            >
                <svg
                    class="rotate-20"
                    width="20"
                    height="20"
                    viewBox="0 0 64 64"
                    ><g fill="#191919" fill-rule="evenodd"
                        ><path d="M6.01 42.439h9.979L20 2H2z" /><ellipse
                            cx="11"
                            cy="54.354"
                            rx="7.664"
                            ry="7.646"
                        /><path
                            d="M40.249 2.064C28.612 2.789 22.531 9.378 22 21.296h11.74c.147-4.129 2.451-7.215 6.741-7.669c4.211-.447 8.205.555 9.415 3.434c1.307 3.11-1.627 6.724-3.022 8.241c-2.582 2.813-6.775 4.865-8.949 7.901c-2.131 2.973-2.51 6.886-2.674 11.675h10.346c.145-3.062.349-5.995 1.742-7.898c2.266-3.092 5.65-4.541 8.486-6.983c2.709-2.334 5.559-5.147 6.043-9.5C63.319 7.466 52.683 1.289 40.249 2.064"
                        /><ellipse
                            cx="40.516"
                            cy="55.566"
                            rx="6.532"
                            ry="6.433"
                        /></g
                    ></svg
                >
                <div class="text-left space-y-1">
                    <p class="font-semibold">{item.title}</p>
                    {#if questionExpanded === index}
                        <p class="text-sm">{item.description}</p>
                    {/if}
                </div>
            </button>
        {/each}
    </div>
</section>

<Footer />
