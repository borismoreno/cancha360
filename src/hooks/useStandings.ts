// src/hooks/useStandings.ts
import { useEffect, useState, useCallback } from "react";
import { standingsService, type TeamStanding } from "../services/standingsService";

export function useStandings(tournamentId: string | null) {
    const [standings, setStandings] = useState<TeamStanding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStandings = useCallback(async () => {
        if (!tournamentId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await standingsService.getTournamentStandings(tournamentId);
            setStandings(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message ?? "Error al obtener tabla de posiciones");
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        fetchStandings();
    }, [fetchStandings]);

    return {
        standings,
        loading,
        error,
        refetch: fetchStandings,
    };
}
