import { ChessInstance } from "chess.js";

import * as _ from "lodash";
import { getPieces, createChessInstance } from "./boardUtils";
import { PieceTypeScores } from "./chessModels";

const copyGame = createChessInstance();

export const scores = {
    max: 1000,
    min: 0
};

export function getPositionalScores(board: ChessInstance): { [color in PieceColor]: number } {
    const pieces = getPieces(board);
    if (pieces.length === 0) {
        return {
            b: scores.min,
            w: scores.min
        };
    }

    if (board.game_over()) {
        if (board.in_checkmate()) {
            if (board.turn() === "w") {
                return {
                    b: scores.max,
                    w: scores.min
                };
            } else {
                return {
                    b: scores.min,
                    w: scores.max
                };
            }
        }

        // Draw.
        return {
            b: scores.min,
            w: scores.min
        };
    }

    const whitePieces = pieces.filter(p => p.color === "w");
    const blackPieces = pieces.filter(p => p.color === "b");

    const baseLineScores = {
        b: _.sumBy(blackPieces, p => PieceTypeScores[p.type]),
        w: _.sumBy(whitePieces, p => PieceTypeScores[p.type])
    };

    /*
    Penalties to consider:
    - Pins (x * value of pinned piece)
    - Forks (average of forked pieces)
    - Double pawns
    - Knight on edge of board?
    */

    /*
    Bonuses to consider:
    - Control of squares (especially center)
    */



    // Add a bonus for number of possible moves.
    const whiteMoves = getMoves(board, "w");
    const blackMoves = getMoves(board, "b");

    return {
        b: baseLineScores.b + (blackMoves.length * 0.1),
        w: baseLineScores.w + (whiteMoves.length * 0.1)
    };
}

export function getMoves(board: ChessInstance, color: PieceColor) {
    if (board.turn() === color) {
        return board.moves();
    }

    const originalTokens = board.fen().split(' ');

    // Load a new game where we modify the fenString to change the current player.
    originalTokens[1] = originalTokens[1] === 'w' ? 'b' : 'w';
    copyGame.load(originalTokens.join(' '));

    return copyGame.moves();
}
