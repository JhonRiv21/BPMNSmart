<script lang="ts">
    import { onMount } from "svelte";
    import BpmnModeler from "bpmn-js/lib/Modeler";
    import defaultDiagram from "$lib/resources/defaultDiagram.bpmn?raw";
    import type CommandStack from "diagram-js/lib/command/CommandStack";
    // import { supabase } from "$lib/utils/supabase";

    let modeler: BpmnModeler | null = null;
    let container: HTMLDivElement | null = null;

    const saveDiagram = async () => {
        // const canvasElement = document.getElementById('js-canvas');

        // if (canvasElement) {
        //     const { data, error } = await supabase
        //         .from('bpmn')
        //         .insert('')
        //         .select('')
        // }
    }

    onMount(async () => {
        if (!container) return;

        modeler = new BpmnModeler({
            container: "#js-canvas",
        });

        await modeler.importXML(defaultDiagram);

        setTimeout(() => {
            const poweredBy = document.querySelector(".bjs-powered-by") as HTMLElement | null;
            if (poweredBy) {
                poweredBy.style.display = "none";
            }
        }, 100);

        let commandStack: CommandStack = modeler.get<CommandStack>('commandStack')

        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'z':
                        if (commandStack.canUndo()) {
                            commandStack.undo();
                        }
                        break;
                    case 'y':
                        if (commandStack.canRedo()) {
                            commandStack.redo();
                        }
                        break;
                }
            }
        })
    });
</script>

<div class="fixed top-24 left-0 w-full h-full bg-[#fff] border border-gray-300" id="js-drop-zone" bind:this={container}>
    <div class="w-full h-full" id="js-canvas"></div>
</div>