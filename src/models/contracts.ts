import { FenString } from "chessbored/lib/contracts";

export interface IApplicationState {
    playground: IPlaygroundState;
}

export interface IPlaygroundState {
    currentPosition: FenString;
    playedMovesInOrder: IChessMove[];
    evaluatedPositions: { [fen: string]: IPositionEvaluation };
}

export interface IChessMove {
    color: PieceColor;
    move: string;
    fenAfterMove: FenString;
}

export interface IPositionEvaluation {
    stockfish: number;
    custom: number;
}
