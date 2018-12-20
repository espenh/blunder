import { combineReducers } from "redux";
import playgroundReducer from "./playgroundReducer";
import { IApplicationState } from "../../models/contracts";

export default combineReducers<IApplicationState>({
    playground: playgroundReducer
});