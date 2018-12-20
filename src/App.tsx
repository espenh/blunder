import React, { Component } from 'react';

import { Provider } from "react-redux";
import store from "./data/store";

import Playground from './components/playground';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BattleView } from './components/battleView';
import { SideBar } from './components/sidebar';

import './app.css';
import { PlayBotView } from './components/playBotView';

class App extends Component {
  public render() {
    return <>
      <Provider store={store}>
        <BrowserRouter>
          <div className="app-container">
            <div className="app-sidebar">
              <SideBar />
            </div>
            <div className="app-main">
              <Switch>
                <Route path="/battle" component={BattleView} />
                <Route path="/playbot" component={PlayBotView} />
                <Route path="/" component={Playground} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    </>;
  }
}

export default App;
