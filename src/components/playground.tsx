import React from "react";
import { Board } from "./chessboard";
import { Editor } from "./editor";
import { Button } from "@material-ui/core";
import { compileTypeScript } from "../utils/tsCompiler";
import { sleep } from "../utils/promiseUtils";

import StockFishCode from '!raw-loader!./../models/sampleStockfishPlayer.d.ts';
import RandomPlayerCode from '!raw-loader!./../models/randomPlayer.d.ts';

export class Playground extends React.Component {

    // Hacky, but we need a quick way of poking into these..
    private board!: Board;
    private editor!: Editor;
    private compiledPlayer: IChessPlayer | undefined;
    private compiledPlayerInitialized: boolean | undefined;

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

    private loadStockfishPlayer = () => {
        this.editor.setState({
            code: StockFishCode
        });
    }

    private loadRandomPlayer = () => {
        this.editor.setState({
            code: RandomPlayerCode
        });
    }

    private compilePlayerCode = async () => {
        let latestCode = this.editor.state.code;

        if (latestCode) {
            try {
                // HACK - Tack on the return here.
                latestCode += "; return player;";

                const jsCode = compileTypeScript(latestCode);
                const playerCreator = new Function(jsCode);

                this.compiledPlayer = playerCreator() as IChessPlayer;
                this.compiledPlayerInitialized = false;
            } catch (err) {
                // TODO - Handle.
                console.error(err);
            }
        }
    }

    private makeAMove = async () => {
        if (!this.compiledPlayer) {
            return;
        }

        if (!this.compiledPlayerInitialized && this.compiledPlayer.initialize) {
            const initializeResult = await Promise.resolve(this.compiledPlayer.initialize());
            if (!initializeResult) {
                return;
            }

            // Wait a bit to make sure that the player is initialized.
            await sleep(2000);
            this.compiledPlayerInitialized = true;
        }

        const game = this.board.getGame();
        if (game.game_over()) {
            return;
        }

        const context: IBoardContext = {
            fen: () => game.fen(),
            possibleMoves: game.moves(),
            turn: game.turn()
        };

        const move = await Promise.resolve(this.compiledPlayer.move(context));
        game.move(move, { sloppy: true });
        this.board.syncWithGame();
    }

    public render() {
        return <>
            <div className="code-and-board">
                <Editor ref={this.captureEditor} />
                <Board ref={this.captureBoard} />
            </div>
            <div className="stats-container">
                <Button onClick={this.compilePlayerCode}>Compile</Button>
                <Button color="primary" onClick={this.makeAMove}>Move</Button>
                <Button color="secondary" onClick={this.resetBoard}>Reset</Button>
                &nbsp;&nbsp;
                <Button onClick={this.loadRandomPlayer}>Random</Button>
                <Button onClick={this.loadStockfishPlayer}>Stockfish</Button>
            </div>
        </>;
    }
}