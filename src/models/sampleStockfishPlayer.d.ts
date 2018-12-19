let stockfish: Worker;
let messages: string[] = [];

// Give Stockfish two seconds to move.
const moveTime = 2000;

const player: IChessPlayer = {
    initialize: () => {
        const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
        stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');
        stockfish.addEventListener('message', (event) => {
            messages.push(event.data);
        });

        stockfish.postMessage("uci");

        return true;
    },
    move: (context) => {
        return getMove(context.fen(), moveTime);
    }
};

const getMove = (fen: string, timeout: number) => {
    // Take some time away from the move time to compensate
    // for misc. overhead (load wasm, create worker, etc.).
    const engineMoveTime = Math.max(timeout - 500, 1000);
    const uciMessagesToSend: string[] = [
        `position fen ${fen}`,
        "setoption name MultiPV value 3",
        `go movetime ${engineMoveTime}`
    ];

    // Clear earlier uci messages and trigger a new calculation.
    messages = [];
    uciMessagesToSend.forEach(thing => {
        stockfish.postMessage(thing);
    });

    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            // We should now have a bestmove message in the received messages.
            // The bestmove message looks like this: bestmove a8c7 ponder a5a7
            const bestMove = messages.find(m => m.startsWith("bestmove"));

            if (bestMove) {
                const move = bestMove.split(" ")[1]
                resolve(move);
            } else {
                reject("No move found.");
            }
        }, timeout);
    });
};