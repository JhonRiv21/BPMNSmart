<script lang="ts">

  type Props = {
    title: string
    text?: string
    onCancel: () => void
    onAction?: () => void
    textAction: string
    children?: any
    colorAction?: string
  }

  const { 
    title,
    text,
    onCancel,
    onAction,
    textAction,
    children,
    colorAction = 'blue'
  }: Props = $props();

</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
              <svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title">{title}</h3>
              <div class="mb-4">
                <p class="text-gray-500">{text}</p>
              </div>
              {@render children()}
            </div>
          </div>
        </div>
        <div class="bg-gray-50 mt-1 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button onclick={onAction} type="button" class="inline-flex w-full justify-center rounded-md bg-{colorAction} px-5 py-2 font-medium text-white shadow-xs hover:bg-{colorAction}/80 sm:ml-3 sm:w-auto transition duration-500 cursor-pointer">{textAction}</button>
          <button onclick={onCancel} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 font-medium text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-100 sm:mt-0 sm:w-auto transition duration-500 cursor-pointer">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</div>