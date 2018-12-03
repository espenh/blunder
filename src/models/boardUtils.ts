import { ChessInstance, Piece } from "chess.js";
import { AllSquares } from "./chessModels";

// tslint:disable-next-line:no-var-requires
export const createChessInstance: () => ChessInstance = require("chess.js");

export function getPieces(board: ChessInstance) {
    const pieces: Piece[] = [];
    AllSquares.forEach(position => {
        const piece = board.get(position);
        if (piece) {
            pieces.push(piece);
        }
    });

    return pieces;
}

export function oppositeColor(color: PieceColor): PieceColor {
    return color === "w" ? "b" : "w";
}
