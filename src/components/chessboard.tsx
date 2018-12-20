import * as React from "react";
import { ChessBoard } from "chessbored";
import { ShortMove } from "chess.js";

export interface IChessBoardProps {
    currentPosition: string;
    turn: PieceColor;
    gameIsOver: boolean;

    makeMove(move: ShortMove): {} | null; // Chess.js returns an object if ok, null otherwise.
}

export class Board extends React.Component<IChessBoardProps> {
    private container: HTMLElement | null | undefined;
    private board!: ChessBoard;

    constructor(props: any) {
        super(props);
        window.addEventListener("resize", this.updateLayout);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateLayout);
        this.board.destroy();
    }

    private updateLayout = () => {
        this.board.resize();
    }

    public componentDidUpdate() {
        this.syncChartWithProps();
    }

    private syncChartWithProps() {
        this.board.position(this.props.currentPosition, false);
    }

    public componentDidMount() {
        if (!this.container) {
            return;
        }

        this.board = new ChessBoard(this.container, {
            position: this.props.currentPosition,
            draggable: true,
            onDrop: (source, target) => {
                if (source === "offboard" || source === "spare") {
                    return;
                }

                if (target === "offboard" || target === "spare") {
                    return;
                }

                const moveResult = this.props.makeMove({
                    from: source,
                    to: target,
                    promotion: "q" // TODO - Might not want to promote to a queen. Should ask player.
                })

                // illegal move
                if (moveResult === null) return 'snapback';
            },
            onMoveEnd: () => {
                // This is called when when moves are made using the api.
                /*if (this.props.handleMoveEnd) {
                    this.props.handleMoveEnd();
                }*/
            },
            onSnapEnd: () => {
                /*this.board.position(this.game.fen());

                // This is called when the user makes a move.
                if (this.props.handleMoveEnd) {
                    this.props.handleMoveEnd();
                }*/
            },
            onDragStart: (_source, piece) => {
                if (this.props.gameIsOver) {
                    return false;
                }

                return this.props.turn === piece[0];
            }
        });
    }

    public render() {
        return <div className="board-container" ref={element => this.container = element} />
    }
}
