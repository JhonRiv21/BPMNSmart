<script lang="ts">
	import { image1, image2, image3, image4 } from '$lib';
	import { benefits } from '$lib/constants/benefits';
	import CheckIcon from '$lib/assets/icons/CheckIcon.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<section>
	<section class="flex w-full flex-col items-center justify-between lg:flex-row">
		<div class="w-full py-16 lg:py-8 xl:py-14">
			<div class="max-w-[95%] space-y-8 pl-5 sm:pl-10 xl:space-y-12">
				<h1 class="text-4xl font-semibold md:text-5xl">
					Bienvenido a <span class="text-green font-bold">BPMNSmart</span>
				</h1>
				<p class="text-2xl md:text-3xl">
					Tu solución para <span class="text-green font-medium"
						>modelado de procesos de negocio</span
					> ágil y eficiente.
				</p>
				<p class="text-2xl md:text-3xl">
					Diseña, personaliza y gestiona <span class="text-green font-medium">diagramas BPMN</span> para
					optimizar tus flujos de trabajo.
				</p>
				<p class="text-2xl font-semibold md:text-3xl">¡Totalmente Gratuito!</p>
			</div>
		</div>

		<div class="w-full">
			<img class="w-full" src={image1} alt="Persona tocando la pantalla de una tablet" />
		</div>
	</section>

	<section class="flex w-full flex-col-reverse items-center justify-between lg:flex-row">
		<div class="w-full">
			<img class="w-full" src={image2} alt="Persona tocando la pantalla de una tablet" />
		</div>

		<div class="w-full py-16 lg:py-8 xl:py-14">
			<div class="max-w-[95%] space-y-12 pl-5 sm:pl-10">
				<h5 class="text-3xl lg:text-4xl">Beneficios:</h5>

				<ul class="space-y-4 md:space-y-6 lg:space-y-8">
					{#each benefits as item}
						<li class="flex flex-row items-center gap-3 text-base md:text-lg">
							<CheckIcon />
							{item.text}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<section class="flex w-full flex-col items-center justify-between lg:flex-row">
		<div class="w-full py-16 lg:py-8 xl:py-14">
			<div class="max-w-[95%] space-y-8 pl-5 sm:pl-10 xl:max-w-[80%] xl:space-y-12">
				<h2 class="text-4xl font-medium">
					¿Quieres ver <span class="text-green font-semibold">BPMNSmart</span> en acción?
				</h2>
				<p class="flex flex-row items-center gap-3 text-lg md:text-xl">
					Prueba nuestra demostración interactiva y descubre lo fácil que es crear diagramas
					personalizados.
					<br /><br />
					¡Sin necesidad de registro!
				</p>
				<div class="flex justify-center">
					<a href="/demo" class="button-principal px-14 py-3.5! sm:px-20!">¡Prueba ahora!</a>
				</div>
			</div>
		</div>

		<div class="w-full">
			<img class="w-full" src={image3} alt="Imagen con palabra DEMO" />
		</div>
	</section>

	<section class="flex w-full flex-col-reverse items-center justify-between lg:flex-row">
		<div class="w-full">
			<img class="w-full" src={image4} alt="Persona tocando la pantalla de una tablet" />
		</div>

		<div class="w-full py-16 lg:py-8 xl:py-14">
			<div class="max-w-[95%] space-y-12 pl-5 sm:pl-10 xl:max-w-[95%]">
				<h2 class="text-4xl font-medium">
					¿Listo para llevar tus <span class="text-green font-semibold">diagramas de flujo</span> al
					siguiente nivel?
				</h2>
				<p class="text-lg md:text-xl">
					Únete a <span class="text-green font-semibold">BPMNSmart:</span> Diseña, gestiona y
					optimiza tus procesos de negocio con
					<span class="text-green font-semibold">total seguridad.</span>
					Nuestra plataforma ofrece
					<span class="text-green font-semibold"
						>flexibilidad, facilidad de uso y control avanzado de versiones.</span
					>
				</p>
				<div class="flex justify-center">
					<a href="#s" class="button-principal px-12 py-3.5! sm:px-16!">Registrarse ahora</a>
				</div>
			</div>
		</div>
	</section>
	<Footer />
</section>
