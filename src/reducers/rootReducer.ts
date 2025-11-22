import { combineReducers } from "redux"
import tournamentReducer from "./tournamentSlice"
import matchReducer from "./matchSlice"

const rootReducer = combineReducers({
    tournament: tournamentReducer,
    match: matchReducer,
})

export default rootReducer
