import { supabase } from "../lib/supabase"

export const organizerService = {
    async getAll() {
        const { data, error } = await supabase
            .from("organizers")
            .select("*")
            .eq('is_superadmin', false)
            .order("created_at", { ascending: false })
        if (error) throw error;

        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from("organizers")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        return data;
    },

    async toggleActive(id: string, isActive: boolean) {
        const { data, error } = await supabase
            .from("organizers")
            .update({
                is_active: isActive
            })
            .eq('id', id)
            .select()
            .maybeSingle()

        if (error) throw error;
        return data;
    }
}