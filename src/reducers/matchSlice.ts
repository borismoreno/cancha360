import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type MatchWithTeams } from "../services/matchService"

interface MatchState {
    matchEditing: MatchWithTeams | null
}

const initialState: MatchState = {
    matchEditing: null
}

export const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        setEditingMatch: (state, action: PayloadAction<MatchWithTeams>) => {
            state.matchEditing = action.payload
        },
        removeEditingMatch: (state) => {
            state.matchEditing = null
        }
    }
})

export const { setEditingMatch, removeEditingMatch } = matchSlice.actions

export default matchSlice.reducer;
