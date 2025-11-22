import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"
import type { MatchWithTeams } from "./matchService"

export type RoundInsert = Database["public"]["Tables"]["rounds"]["Insert"]
export type Round = Database["public"]["Tables"]["rounds"]["Row"]

export type RoundWithMatches = Round & { matches: MatchWithTeams[] }

export const roundService = {
    async createRounds(payload: RoundInsert[]): Promise<Round[]> {
        const { data: createdRounds, error: roundError } = await supabase
            .from("rounds")
            .insert(payload)
            .select();

        if (roundError) throw roundError;

        return createdRounds
    },

    async getRoundsByTournament(tournamentId: string): Promise<RoundWithMatches[]> {
        const { data: roundsData, error: roundError } = await supabase
            .from("rounds")
            .select("*, matches(*, local_team:local_team_id(id, name), visitor_team:visitor_team_id(id, name))")
            .eq("tournament_id", tournamentId)
            .order("round_number")
            .order("match_order", { referencedTable: "matches" })

        if (roundError) throw roundError;

        const roundsWithMatches: RoundWithMatches[] = (roundsData ?? []).map((round) => ({
            ...round,
            matches: (round as any).matches ?? [],
        }))

        return roundsWithMatches
    }
}
