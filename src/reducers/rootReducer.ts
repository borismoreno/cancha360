import { combineReducers } from "redux";
import tournamentReducer from './tournamentSlice';

const rootReducer = combineReducers({
    tournament: tournamentReducer
})

export default rootReducer;