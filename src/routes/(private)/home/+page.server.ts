import { supabase } from "$lib/utils/supabase";

export async function load() {
    const { data, error } = await supabase.from('bpmn').select('*');
    console.log(data, error);
    return {
        data
    }
}