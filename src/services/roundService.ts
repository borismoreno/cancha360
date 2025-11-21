import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"

export type RoundInsert = Database["public"]["Tables"]["rounds"]["Insert"]
export type Round = Database["public"]["Tables"]["rounds"]["Row"]

export const roundService = {
    async createRounds(payload: RoundInsert[]): Promise<Round[]> {
        const { data: createdRounds, error: roundError } = await supabase
            .from("rounds")
            .insert(payload)
            .select();

        if (roundError) throw roundError;

        return createdRounds
    }
}
