import React, { Component } from 'react';
import './App.css';
import { Board } from "./chessboard";
import { Editor } from "./test";

class App extends Component {
  public state = {
    value: 0
  };

  public handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  public render() {
    const { value } = this.state;
    return (
      <div className="app-container">
        <div className="code-and-board">
          <Editor />
          <Board />
        </div>
        <div className="stats-container">Stats here?</div>
      </div>
    );
  }
}

class TabContainer extends React.Component {
  public render() {
    return <div className="tab-container">{this.props.children}</div>;
  }
}

export default App;
