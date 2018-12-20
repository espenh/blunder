import { FenString } from "chessbored/lib/contracts";

export enum PlaygroundActionsType {
    SetCurrentPosition = "set-current-position"
}

export interface ISetCurrentPosition {
    type: PlaygroundActionsType.SetCurrentPosition;
    payload: {
        position: FenString
    }
}

export type PlaygroundAction = ISetCurrentPosition;

export const setCurrentPosition = (position: FenString) => {
    const newScore: ISetCurrentPosition = {
        type: PlaygroundActionsType.SetCurrentPosition,
        payload: {
            position: position
        }
    };

    return newScore;
};
