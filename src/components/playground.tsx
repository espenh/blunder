import React from "react";
import { Board } from "./chessboard";
import { Editor } from "./editor";
import { Button } from "@material-ui/core";
import { compileTypeScript } from "../utils/tsCompiler";

export class Playground extends React.Component {

    // Hacky, but we need a quick way of poking into these..
    private board!: Board;
    private editor!: Editor;

    private captureBoard = (board: Board) => {
        this.board = board;
    }

    private captureEditor = (editor: Editor) => {
        this.editor = editor;
    }

    private resetBoard = () => {
        this.board.getGame().reset();
        this.board.syncWithGame();
    }

    private compileAndMove = () => {
        let latestCode = this.editor.state.code;

        if (latestCode) {
            try {
                // HACK - Tack on the return here.
                latestCode += "; return player;";

                const jsCode = compileTypeScript(latestCode);
                const playerCreator = new Function(jsCode);
                const player = playerCreator() as IChessPlayer;

                this.makeAMove(player);
            } catch (err) {
                console.error(err);
            }
        }
    }

    private makeAMove(player: IChessPlayer) {
        const game = this.board.getGame();
        if (game.game_over()) {
            return;
        }

        const context: IBoardContext = {
            fen: () => game.fen(),
            possibleMoves: game.moves(),
            turn: game.turn()
        };

        const move = player.move(context);
        game.move(move);
        this.board.syncWithGame();
    }

    public render() {
        return <>
            <div className="code-and-board">
                <Editor ref={this.captureEditor} />
                <Board ref={this.captureBoard} />
            </div>
            <div className="stats-container">
                <Button onClick={this.compileAndMove}>Move</Button>
                <Button onClick={this.resetBoard}>Reset</Button>
            </div>
        </>;
    }
}