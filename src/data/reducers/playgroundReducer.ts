import * as _ from "lodash";
import { Reducer } from "redux";
import { IPlaygroundState } from "../../models/contracts";
import { PlaygroundAction, PlaygroundActionsType } from "../actions/playgroundActions";

const initialPlaygroundState: IPlaygroundState = {
  // Use the classical starting position as default.
  currentPosition: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  evaluatedPositions: {},
  playedMovesInOrder: []
};

const playgroundReducer: Reducer<IPlaygroundState, PlaygroundAction> = (state: IPlaygroundState = initialPlaygroundState, action: PlaygroundAction) => {
  switch (action.type) {
    case PlaygroundActionsType.SetCurrentPosition:
      return {
        ...state,
        currentPosition: action.payload.position
      };
  }
  
  return state;
};

export default playgroundReducer;