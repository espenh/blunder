const player: IChessPlayer = {
    move: (context) => {
        return context.possibleMoves[Math.floor(Math.random() * context.possibleMoves.length)];
    }
};