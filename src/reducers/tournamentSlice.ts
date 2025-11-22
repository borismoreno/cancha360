import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TournamentState {
    tournament:
    {
        id: string;
        name: string;
    } | null
}

const initialState: TournamentState = {
    tournament: null
}

export const tournamentSlice = createSlice({
    name: 'tournament',
    initialState,
    reducers: {
        setTournament: (state, action: PayloadAction<{ id: string, name: string }>) => {
            state.tournament = action.payload;
        },
        removeTournament: (state) => {
            state.tournament = null
        }
    }
})

export const { setTournament, removeTournament } = tournamentSlice.actions
export const selectTournament = (state: { tournament: TournamentState }) => state.tournament

export default tournamentSlice.reducer;