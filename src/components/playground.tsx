import React from "react";
import { Board } from "./chessboard";
import { Editor } from "./editor";
import { Button } from "@material-ui/core";
import { compileTypeScript } from "../utils/tsCompiler";
import { sleep } from "../utils/promiseUtils";

import StockFishCode from '!raw-loader!./../models/sampleStockfishPlayer.d.ts';
import RandomPlayerCode from '!raw-loader!./../models/randomPlayer.d.ts';
import { ScoreChart, IMoveScore } from "./scoreChart";
import _ from "lodash";

export class Playground extends React.Component {

    // Hacky, but we need a quick way of poking into these..
    private board!: Board;
    private editor!: Editor;

    // Store the compiled player. Deleted on code change.
    private compiled: {
        player: IChessPlayer,
        isInitialized: boolean
    } | undefined;

    public state: {
        scores: IMoveScore[]
    } = {
            // Store a score for each move.
            scores: []
        }

    private captureBoard = (board: Board) => {
        this.board = board;
    }

    private captureEditor = (editor: Editor) => {
        this.editor = editor;
    }

    private handleCodeChange = () => {
        this.compiled = undefined;
        // TODO - How to clean up? Might need optional .dispose() on player.
    }

    private handleMoveCompleted = () => {
        const game = this.board.getGame();
        const currentScore = this.state.scores;
        
        const newScore: IMoveScore = {
            move: game.history().length + 1,
            score: {
                w: _.random(0,5),
                b: _.random(0,5)
            }
        };

        this.setState({
            scores: [...currentScore, newScore]
        });
    }

    private resetBoard = () => {
        this.board.getGame().reset();
        this.board.syncWithGame();

        this.setState({
            scores: []
        });
    }

    private loadStockfishPlayer = () => {
        this.editor.setState({
            code: StockFishCode
        });
        this.handleCodeChange();
    }

    private loadRandomPlayer = () => {
        this.editor.setState({
            code: RandomPlayerCode
        });
        this.handleCodeChange();
    }

    private compilePlayerCode = async (codeToCompile: string) => {
        if (codeToCompile) {
            try {
                // HACK - Tack on the return here.
                codeToCompile += "; return player;";

                const jsCode = compileTypeScript(codeToCompile);
                const playerCreator = new Function(jsCode);

                this.compiled = {
                    player: playerCreator() as IChessPlayer,
                    isInitialized: false
                };
            } catch (err) {
                // TODO - Handle.
                console.error(err);
            }
        }
    }

    private makeAMove = async () => {
        const game = this.board.getGame();
        if (game.game_over()) {
            return;
        }

        // Compile and initialize the player.
        if (!this.compiled) {
            const latestCode = this.editor.state.code;
            await this.compilePlayerCode(latestCode);
            if (!this.compiled) {
                return;
            }
        }

        if (!this.compiled.isInitialized && this.compiled.player.initialize) {
            const initializeResult = await Promise.resolve(this.compiled.player.initialize());
            if (!initializeResult) {
                // TODO - Handle this. Player might be dependent on service that's not available.
                return;
            }

            // Wait a bit to make sure that the player is initialized.
            await sleep(2000);
            this.compiled.isInitialized = true;
        }

        // Set up a context and use the compiled player to make a move.
        const context: IBoardContext = {
            fen: () => game.fen(),
            possibleMoves: game.moves(),
            turn: game.turn()
        };

        const moveFromPlayer = await Promise.resolve(this.compiled.player.move(context));
        game.move(moveFromPlayer, { sloppy: true });

        this.board.syncWithGame();
    }

    public render() {
        return <>
            <div className="code-and-board">
                <Editor ref={this.captureEditor} handleCodeChange={this.handleCodeChange} />
                <Board ref={this.captureBoard} handleMoveEnd={this.handleMoveCompleted} />
            </div>
            <div className="stats-container">
                <div className="toolbar">
                    <Button color="primary" onClick={this.makeAMove}>Move</Button>
                    <Button color="secondary" onClick={this.resetBoard}>Reset</Button>
                    <Button onClick={this.loadRandomPlayer}>Random</Button>
                    <Button onClick={this.loadStockfishPlayer}>Stockfish</Button>
                </div>
                <div className="charts">
                    <ScoreChart scores={this.state.scores} />
                </div>
            </div>
        </>;
    }
}