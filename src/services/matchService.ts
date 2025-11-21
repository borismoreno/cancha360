import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

export type MatchInsert = Database["public"]["Tables"]["matches"]["Insert"]
export type Match = Database["public"]["Tables"]["matches"]["Row"]

export const matchService = {
    async createMatches(payload: MatchInsert[]): Promise<Match[]> {
        const { data: matchesData, error: matchError } = await supabase
            .from("matches")
            .insert(payload)
            .select();

        if (matchError) throw matchError;
        return matchesData
    }
}