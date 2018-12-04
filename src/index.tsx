import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, Theme, MuiThemeProvider, CssBaseline, withStyles } from '@material-ui/core';
import { blue, pink } from '@material-ui/core/colors';

/*declare const WebAssembly: any;
var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
var stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');
stockfish.addEventListener('message', function (e) {
    console.log(e.data);
});

const thingsToSend: string[] = [
    "position fen N7/P3pk1p/3p2p1/r4p2/8/4b2B/4P1KP/1R6 w - - 0 34",
    "setoption name MultiPV value 3",
    "go movetime 5000"
];

thingsToSend.forEach(thing => {
    stockfish.postMessage(thing);
});*/

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
