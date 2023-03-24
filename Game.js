class Game {
    

    isDraw(allMoves){
        let pieces = []
        let moveCounter = 0
        for (let i = 0; i < Board.Squares.length; i++) {
            if (Board.Squares[i].piece != 0){
                pieces.push(Board.Squares[i]);
            }
        }
        // if(allMoves.length >= 7 + 4){

        //     for (let i = allMoves.length - 7; i < allMoves.length; i++) {
        //         // for (let j = allMoves.length - 7; j < allMoves.length; j++) {
        //             if (allMoves[i].startSquare == allMoves[i - 2].targetSquare){
        //             print(allMoves)
        //                 moveCounter++
        //             }
        //         // }
        //     }
        // }
        return ((pieces.length == 2) && !mouseIsPressed) || moveCounter >= 3
        
    }

    win(moves, isChecked, allMoves){
        if (Board.turn == Pieces.Black && moves.length <= 0 && isChecked){
            return {white: true, black: false}
            
        }
        else if (Board.turn == Pieces.White && moves.length <= 0 && isChecked){
            return { white: false, black: true }
            
        }
        if (Board.turn == Pieces.Black && moves.length <= 0){
            return { white: false, black: false}
            
        }
        else if (Board.turn == Pieces.White && moves.length <= 0){
            return { white: false, black: false }
            
        }
        else if (this.isDraw(allMoves)){
            return { white: false, black: false }
            
        }
        else{
            return { white: true, black: true }

        }
    }


}