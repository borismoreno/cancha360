import { supabase } from "../lib/supabase";

export const accessCodeService = {
    async getAll(status?: "used" | "unused") {
        let query = supabase.from("access_codes").select("*").order("created_at", { ascending: false });

        if (status === "used") query = query.eq("is_used", true);
        if (status === "unused") query = query.eq("is_used", false);

        const { data, error } = await query;
        if (error) throw error;

        return data;
    },

    async validate(code: string) {
        const { data, error } = await supabase
            .from("access_codes")
            .select("*")
            .eq("code", code)
            .eq("is_used", false)
            .single();

        if (error) return null;
        return data;
    },

    async markAsUsed(codeId: string, userId: string, email: string) {
        const { data, error } = await supabase
            .from("access_codes")
            .update({
                is_used: true,
                used_by: userId,
                used_by_email: email,
                used_at: new Date().toISOString()
            })
            .eq("id", codeId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}