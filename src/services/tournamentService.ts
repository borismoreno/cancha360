import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";
import { teamService, type TeamInsert } from "./teamService";
import { roundService, type RoundInsert } from "./roundService";
import { matchService, type MatchInsert } from "./matchService";

export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];
export type TournamentInsert = Database["public"]["Tables"]["tournaments"]["Insert"];
export type TournamentUpdate = Database["public"]["Tables"]["tournaments"]["Update"];

// Types para recibir el fixture generado en el frontend
export type FixturePayload = {
    name: string;
    category: string;
    season: string;
    teamCount: number;
    tentativeStartDate: string | null;
    formatType: "single" | "double";
    teams: string[];
    rounds: {
        roundNumber: number;
        matches: { local: string; visitor: string }[];
    }[];
};

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

    async saveTournamentFull(payload: FixturePayload) {
        const { name, category, season, tentativeStartDate, teamCount, formatType, teams, rounds } = payload;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return null;

        // 1. Slug generado automáticamente
        const slug = generateTournamentSlug(name, season);

        // ========================================================
        // 1. Insertar torneo
        // ========================================================
        const tournamentData: TournamentInsert = {
            organizer_id: userData.user.id,
            team_count: teamCount,
            name,
            category,
            season,
            tentative_start_date: tentativeStartDate ?? null,
            format_type: formatType,
            public_slug: slug,
        };

        const { data: tournament, error: tError } = await supabase
            .from("tournaments")
            .insert(tournamentData)
            .select()
            .single();

        if (tError) throw tError;

        // ========================================================
        // 2. Insertar equipos
        // ========================================================
        const teamPayload: TeamInsert[] = teams.map((teamName) => ({
            name: teamName,
            tournament_id: tournament.id,
        }));

        const teamResponse = await teamService.createTeams(teamPayload)

        const teamsMap = Object.fromEntries(
            teamResponse.map((t) => [t.name, t.id])
        );

        // ========================================================
        // 3. Insertar rounds
        // ========================================================
        const roundsPayload: RoundInsert[] = rounds.map((r) => ({
            round_number: r.roundNumber,
            tournament_id: tournament.id,
        }));

        const roundResponse = await roundService.createRounds(roundsPayload);

        const roundsMap = Object.fromEntries(
            roundResponse.map((r) => [r.round_number, r.id])
        );

        // ========================================================
        // 4. Insertar partidos
        // ========================================================
        const matchesPayload: MatchInsert[] = rounds.flatMap((r) =>
            r.matches.map((m, idx) => ({
                round_id: roundsMap[r.roundNumber],
                local_team_id: teamsMap[m.local],
                visitor_team_id: teamsMap[m.visitor],
                match_order: idx + 1,
                scheduled_date: null,
                scheduled_time: null,
            }))
        );

        await matchService.createMatches(matchesPayload)

        // ========================================================
        // Final
        // ========================================================
        return {
            ok: true,
            tournamentId: tournament.id,
        };
    }
}

function generateTournamentSlug(name: string, season: string) {
    return (
        name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/[^a-z0-9\s]/g, "") // remove symbols
            .trim()
            .replace(/\s+/g, "_") +
        "_" +
        season
    );
}