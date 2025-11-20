import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];
export type TournamentInsert = Database["public"]["Tables"]["tournaments"]["Insert"];
export type TournamentUpdate = Database["public"]["Tables"]["tournaments"]["Update"];

export const tournamentService = {
    async getAll(): Promise<Tournament[]> {
        const { data, error } = await supabase
            .from("tournaments")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data;
    },

    async getMyTournaments(): Promise<Tournament[]> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return [];

        const { data, error } = await supabase
            .from("tournaments")
            .select("*")
            .eq("organizer_id", userData.user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data;
    },

    async getById(id: string): Promise<Tournament | null> {
        const { data, error } = await supabase
            .from("tournaments")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
    },

    async createTournament(payload: TournamentInsert): Promise<Tournament> {
        const { data, error } = await supabase
            .from("tournaments")
            .insert(payload)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async updateTournament(id: string, payload: TournamentUpdate): Promise<Tournament> {
        const { data, error } = await supabase
            .from("tournaments")
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    },
}