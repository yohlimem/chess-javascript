class Bot {
    constructor() {
        
    }
    makeMove(moveArray) {
        // for (let i = 0; i < Moves.moves.length; i++) {
        //     // const move = Moves.moves[i];

        // }

        // return move
        if(moveArray.length >= 1){
            const choose = floor(random(0, moveArray.length))
            const move = moveArray[choose]
            // print("choose: ", choose)
            // print("move array: ", moveArray)
            // print("move", move)
            // print("Board.Squares", Board.Squares[moveArray[choose].startSquare])
            const piece = Board.Squares[moveArray[choose].startSquare].piece
            return { startSquare: move.startSquare, targetSquare: move.targetSquare, piece: piece }
            
        }else{
            // print("no more moves.")
            // print("moves:", moveArray)
            return { startSquare: 0, targetSquare: 0, piece: 0 }
        }

        
        
    }
}