import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Test } from "./test";
import { Board } from "./chessboard";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Test/>
        <Board/>
      </div>
    );
  }
}

export default App;
