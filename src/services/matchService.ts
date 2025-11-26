import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

export type MatchInsert = Database["public"]["Tables"]["matches"]["Insert"]
export type MatchUpdate = Database["public"]["Tables"]["matches"]["Update"]
export type Match = Database["public"]["Tables"]["matches"]["Row"]

export type MatchWithTeams = Match & {
    local_team?: { id: string; name: string | null };
    visitor_team?: { id: string; name: string | null };
}

export const matchService = {
    async createMatches(payload: MatchInsert[]): Promise<Match[]> {
        const { data: matchesData, error: matchError } = await supabase
            .from("matches")
            .insert(payload)
            .select();

        if (matchError) throw matchError;
        return matchesData ?? []
    },

    async getMatchesByRound(roundId: string): Promise<Match[]> {
        const { data, error } = await supabase
            .from("matches")
            .select("*")
            .eq("round_id", roundId)
            .order("match_order")

        if (error) throw error;

        return data ?? []
    },

    async getMatchById(id: string): Promise<MatchWithTeams> {
        const { data, error } = await supabase
            .from("matches")
            .select("*, local_team:local_team_id(id, name), visitor_team:visitor_team_id(id, name)")
            .eq("id", id)
            .single<MatchWithTeams>()

        if (error) throw error;
        if (!data) throw new Error("Partido no encontrado");

        return {
            ...data,
            local_team: data.local_team ?? undefined,
            visitor_team: data.visitor_team ?? undefined,
        }
    },

    async updateMatch(id: string, payload: MatchUpdate): Promise<MatchWithTeams> {
        const { data, error } = await supabase
            .from("matches")
            .update(payload)
            .eq("id", id)
            .select("*, local_team:local_team_id(id, name), visitor_team:visitor_team_id(id, name)")
            .single<MatchWithTeams>()

        if (error) throw error
        if (!data) throw new Error("Partido no encontrado")

        return {
            ...data,
            local_team: data.local_team ?? undefined,
            visitor_team: data.visitor_team ?? undefined,
        }
    }
}
