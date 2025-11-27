import { supabase } from "../lib/supabase"
import type { Database } from "../lib/database.types"

export type TeamStanding = Database["public"]["Functions"]["get_standings"]["Returns"][number]

export const standingsService = {
    async getTournamentStandings(tournamentId: string): Promise<TeamStanding[]> {
        const { data, error } = await supabase.rpc("get_standings", { tournament_id: tournamentId })

        if (error) throw error

        return data as TeamStanding[]
    }
}