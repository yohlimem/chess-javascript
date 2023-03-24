class stockfish{
    constructor() {
        // Create a new Web Worker
        this.worker = new Worker('stockfish.js');

        // Bind the event handler method to the correct context
        this.handleWorkerMessage = this.handleWorkerMessage.bind(this);

        // Listen for messages from Stockfish
        this.worker.onmessage = this.handleWorkerMessage;
    }
    start(fen, level){

        this.worker.postMessage('ucinewgame');

        this.worker.postMessage(`position fen ${fen}`);
        
        this.worker.postMessage('go movetime 3000')

        this.worker.postMessage(`setoption name Skill Level value ${level}`)

        this.worker.postMessage("go depth 12")
    }

    handleWorkerMessage(event) {
        // Parse the output from Stockfish
        const output = event.data;
        const bestMoveRegex = /^bestmove\s(\w{4})/;
        const bestMoveMatch = bestMoveRegex.exec(output);
        if (bestMoveMatch) {
            this.bestMove = bestMoveMatch[1].toString();
        }
    }
}