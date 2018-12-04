import React, { Component } from 'react';
import './app.css';
import { Button } from "@material-ui/core";
import { MainView } from './components/mainView';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CompetitionView } from './components/competitionView';

class App extends Component {
  public state = {
    value: 0
  };

  public handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  public render() {
    return <>
      <BrowserRouter>
        <div className="app-container">
          <div className="app-sidebar">
            <Button>X</Button>
          </div>
          <div className="app-main">
            <Switch>
              <Route path="/competition" component={CompetitionView} />
              <Route path="/" component={MainView} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </>;
  }
}

export default App;
