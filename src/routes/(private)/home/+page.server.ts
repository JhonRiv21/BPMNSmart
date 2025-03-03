import { supabase } from "$lib/utils/supabase";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase.from('bpmn').select('*');
    if (data) {
        return {
            bpmn: data
        }
    } else {
        console.error(error)
    }
};

export const actions: Actions = {
    createDiagram: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const name_diagram = formData.get('name_diagram') as string;

        const { data, error } = await supabase
            .from('bpmn')
            .insert({ name_diagram })
            .select('*')

        if (error) {
            console.error(error)
        } else {
            throw redirect(303, `/diagram/${data[0].id}`)
        }
    },


    deleteDiagram: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const id = formData.get('id') as string;

        const { error } = await supabase
            .from('bpmn')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(error)
        } else {
            return { success: true, id };
        }
    },
} satisfies Actions;