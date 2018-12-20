import _ from "lodash";
import React from "react";
import { Button, CircularProgress } from "@material-ui/core";

import { Board } from "./chessboard";
import { Editor } from "./editor";
import { compileTypeScript } from "../utils/tsCompiler";
import { sleep } from "../utils/promiseUtils";

import StockFishCode from '!raw-loader!./../models/sampleStockfishPlayer.d.ts';
import RandomPlayerCode from '!raw-loader!./../models/randomPlayer.d.ts';
import { ScoreChart, IMoveScore } from "./scoreChart";
import { getPositionalScores } from "../models/boardScorer";
import { oppositeColor, createChessInstance } from "../models/boardUtils";
import { hashCode } from "../models/hashUtils";
import { connect } from "react-redux";
import { IApplicationState } from "../models/contracts";
import { FenString } from "chessbored/lib/contracts";
import { ChessInstance, ShortMove } from "chess.js";
import { setCurrentPosition } from "../data/actions/playgroundActions";

interface ICompiledPlayer {
    player: IChessPlayer;
    isInitialized: boolean;
}

interface IPlaygroundProps {
    currentPosition: FenString;
}

interface IPlaygroundMethods {
    setCurrentPosition(position: FenString): void;
}

class PlaygroundView extends React.Component<IPlaygroundProps & IPlaygroundMethods>{

    private static gameInstance: ChessInstance = createChessInstance();

    private editor!: Editor;

    // Store the compiled player. Deleted on code change.
    private cachedPlayersByHash: { [hash: string]: ICompiledPlayer } = {};

    public state: {
        isComputing: boolean,
        scores: IMoveScore[]
    } = {
            isComputing: false,
            // Store a score for each move.
            scores: []
        }

    private captureEditor = (editor: Editor) => {
        this.editor = editor;
    }

    private handlePlayerMoveCandidate = (move: ShortMove) => {
        const game = PlaygroundView.gameInstance;
        const moveResult = game.move(move);
        this.syncPositionWithStore();
        return moveResult;
        /*const currentScore = this.state.scores;

        const moves = game.history();

        if (!moves.length) {
            this.setState({
                scores: []
            });
        } else {
            const positionalScore = getPositionalScores(game);

            const newScore: IMoveScore = {
                sequence: moves.length,
                moveMadeBy: oppositeColor(game.turn()),
                move: moves[moves.length - 1],
                score: positionalScore
            };

            this.setState({
                scores: [...currentScore, newScore]
            });
        }*/
    }

    private resetBoard = () => {
        PlaygroundView.gameInstance.reset();
        this.syncPositionWithStore();

        this.setState({
            scores: []
        });
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

    private compilePlayerCode = async (codeToCompile: string): Promise<ICompiledPlayer | undefined> => {
        try {
            // HACK - Tack on the return here.
            codeToCompile += "; return player;";

            const jsCode = compileTypeScript(codeToCompile);
            const playerCreator = new Function(jsCode);

            return {
                player: playerCreator() as IChessPlayer,
                isInitialized: false
            };
        } catch (err) {
            // TODO - Handle.
            console.error(err);
            return undefined;
        }
    }

    private getCompiledPlayer = async (latestCode: string) => {
        const playerHash = hashCode(latestCode);
        if (!this.cachedPlayersByHash[playerHash]) {
            // Compile and initialize the player.
            const player = await this.compilePlayerCode(latestCode);
            if (!player) {
                return;
            }

            // Run the initialization function if defined.
            if (!player.isInitialized && player.player.initialize) {
                const initializeResult = await Promise.resolve(player.player.initialize());
                if (!initializeResult) {
                    // TODO - Handle this. Player might be dependent on service that's currently not available.
                    return;
                }

                // Wait a bit to make sure that the player is initialized.
                await sleep(2000);
                player.isInitialized = true;
            }

            this.cachedPlayersByHash[playerHash] = player;
        }

        return this.cachedPlayersByHash[playerHash];
    }

    private syncPositionWithStore() {
        this.props.setCurrentPosition(PlaygroundView.gameInstance.fen());
    }

    private makeAMove = async () => {
        // Capture the active element.
        const activeElement = document.activeElement as HTMLButtonElement | null;

        const game = PlaygroundView.gameInstance;
        if (game.game_over()) {
            return;
        }

        this.setState({
            isComputing: true
        });

        try {
            const latestCode = this.editor.state.code;
            const player = await this.getCompiledPlayer(latestCode);

            if (player) {
                // Set up a context and use the compiled player to make a move.
                const context: IBoardContext = {
                    fen: () => game.fen(),
                    possibleMoves: game.moves(),
                    turn: game.turn()
                };

                const moveFromPlayer = await Promise.resolve(player.player.move(context));
                game.move(moveFromPlayer, { sloppy: true });

                this.syncPositionWithStore();
            }
        } catch (err) {
            // TOOD Handle errors.
        }

        this.setState({
            isComputing: false
        }, () => {
            // Hack: It might have taken some time to make the move, and the move-button is disabled when "thinking".
            // To let the user just keep pressing enter on the button, we set the focus back when the button is enabled.
            if (activeElement && activeElement.focus) {
                activeElement.focus();
            }
        });
    }

    public render() {
        return <>
            <div className="code-and-board">
                <Editor ref={this.captureEditor} />
                <Board
                    currentPosition={this.props.currentPosition}
                    turn={PlaygroundView.gameInstance.turn()}
                    gameIsOver={PlaygroundView.gameInstance.game_over()}
                    makeMove={this.handlePlayerMoveCandidate}
                />
            </div>
            <div className="stats-container">
                <div className="toolbar">
                    <div style={{ position: "relative" }}>
                        <Button color="primary" onClick={this.makeAMove} disabled={this.state.isComputing}>Move</Button>
                        {this.state.isComputing && <CircularProgress size={24} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12 }} />}
                    </div>
                    <Button color="secondary" onClick={this.resetBoard} disabled={this.state.isComputing}>Reset</Button>
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

const mapProps = (state: IApplicationState): IPlaygroundProps => {
    return {
        currentPosition: state.playground.currentPosition
    };
};

const mapDispatch = {
    setCurrentPosition
};

const Playground = connect(mapProps, mapDispatch)(PlaygroundView);
export default Playground;