import React, { Component } from 'react';
import { Playground } from './components/playground';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BattleView } from './components/battleView';
import { SideBar } from './components/sidebar';

import './app.css';
import { PlayBotView } from './components/playBotView';

class App extends Component {
  public render() {
    return <>
      <BrowserRouter>
        <div className="app-container">
          <div className="app-sidebar">
            
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
    </>;
  }
}

export default App;
