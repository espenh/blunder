import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, Theme, MuiThemeProvider, CssBaseline, withStyles } from '@material-ui/core';
import { blue, pink } from '@material-ui/core/colors';
import { BrowserRouter } from 'react-router-dom';

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: pink,
    },
});

const styles = (someTheme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: someTheme.palette.background.paper,
    },
});

const StyledApp = withStyles(styles)(App);

const container = <MuiThemeProvider theme={theme}>
    <React.Fragment>
        <CssBaseline />
        <StyledApp />
    </React.Fragment>
</MuiThemeProvider>;

ReactDOM.render(container, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
