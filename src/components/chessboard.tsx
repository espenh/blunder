import * as React from "react";
import { ChessBoard } from "chessbored";
import { ChessInstance } from "chess.js";

export class Board extends React.Component {
    private container: HTMLElement | null | undefined;
    private board!: ChessBoard;
    private game!: ChessInstance;

    constructor(props: any) {
        super(props);
        window.addEventListener("resize", this.updateLayout);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateLayout);
    }

    private updateLayout = () => {
        this.board.resize();
    }

    public componentDidMount() {
        if (!this.container) {
            return;
        }

        this.game = this.createChessInstance();

        this.board = new ChessBoard(this.container, {
            position: "start",
            draggable: true,
            onDrop: (source, target) => {
                if (source === "offboard" || source === "spare") {
                    return;
                }

                if (target === "offboard" || target === "spare") {
                    return;
                }

                const move = this.game.move({
                    from: source,
                    to: target,
                    promotion: "q"
                });

                // illegal move
                if (move === null) return 'snapback';
            },
            onSnapEnd: () => {
                this.board.position(this.game.fen());
            },
            onDragStart: (_source, piece) => {
                if (this.game.game_over()) {
                    return false;
                }

                return this.game.turn() === piece[0];
            }
        });
    }

    public render() {
        return <div className="board-container" ref={element => this.container = element} />
    }

    private createChessInstance: () => ChessInstance = require("chess.js");
}