// src/services/accessCodeRequestService.ts
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type AccessCodeRequest = Database["public"]["Tables"]["access_code_requests"]["Row"];
type AccessCodeRequestInsert = Database["public"]["Tables"]["access_code_requests"]["Insert"];

export const accessCodeRequestService = {

    /** Crear nueva solicitud */
    async create(data: {
        phone: string;
        organization_name?: string | null;
    }): Promise<AccessCodeRequest> {

        const { data: session } = await supabase.auth.getUser();
        if (!session?.user) throw new Error("Usuario no autenticado");

        const payload: AccessCodeRequestInsert = {
            user_id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata.full_name ?? "Sin nombre",
            phone: data.phone,
            organization_name: data.organization_name ?? null,
            status: "pending",
        };

        const { data: inserted, error } = await supabase
            .from("access_code_requests")
            .insert(payload)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return inserted!;
    },

    /** Obtener solicitudes del usuario */
    async getMyRequests(): Promise<AccessCodeRequest[]> {
        const { data: session } = await supabase.auth.getUser();
        if (!session?.user) return [];

        const { data, error } = await supabase
            .from("access_code_requests")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data!;
    },

    /** (SuperAdmin) Obtener todas las solicitudes */
    async getAll(): Promise<AccessCodeRequest[]> {
        const { data, error } = await supabase
            .from("access_code_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data!;
    },

    /** (SuperAdmin) Cambiar estado */
    async updateStatus(
        id: string,
        status: "pending" | "approved" | "denied"
    ): Promise<AccessCodeRequest> {

        const { data, error } = await supabase
            .from("access_code_requests")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data!;
    },
};
