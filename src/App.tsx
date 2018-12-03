import { AppBar, Tab, Tabs } from "@material-ui/core";
import React, { Component } from 'react';
import './App.css';
import { Board } from "./chessboard";
import { Test } from "./test";

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
          <AppBar position="static">
            <Tabs className="tab-bar" value={value} onChange={this.handleChange}>
              <Tab label="Code" />
              <Tab label="Board" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><Test /></TabContainer>}
          {value === 1 && <TabContainer><Board /></TabContainer>}
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
