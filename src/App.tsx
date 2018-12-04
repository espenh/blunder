import React, { Component } from 'react';
import './app.css';
import { Button } from "@material-ui/core";
import { Playground } from './components/playground';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { CompetitionView } from './components/competitionView';

class App extends Component {
  public state = {
    value: 0
  };

  public handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  public render() {
    const competitionLink = (props: any) => <Link to="/competition" {...props} />
    const playgroundLink = (props: any) => <Link to="/" {...props} />

    return <>
      <BrowserRouter>
        <div className="app-container">
          <div className="app-sidebar">
            <Button component={competitionLink}>C</Button>
            <Button component={playgroundLink}>P</Button>
          </div>
          <div className="app-main">
            <Switch>
              <Route path="/competition" component={CompetitionView} />
              <Route path="/" component={Playground} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </>;
  }
}

export default App;
