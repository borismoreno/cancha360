import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

export type TeamInsert = Database["public"]["Tables"]["teams"]["Insert"]
export type Team = Database["public"]["Tables"]["teams"]["Row"]

export const teamService = {
    async createTeams(payload: TeamInsert[]): Promise<Team[]> {
        const { data: createdTeams, error: teamError } = await supabase
            .from("teams")
            .insert(payload)
            .select();

        if (teamError) throw teamError;

        return createdTeams
    }
}