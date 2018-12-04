import React from "react";
import { Board } from "./chessboard";
import { Editor } from "./editor";

export class MainView extends React.Component {
    public render() {
        return <> <div className="code-and-board">
            <Editor />
            <Board />
        </div>
            <div className="stats-container">Stats here?</div>
        </>;
    }
}