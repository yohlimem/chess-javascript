class Moves {

    // TODO: quality of life improvements

    static legalMoves = []
    
    static numSquaresToEdge = this.calculateMoves();
    static knightPositions = [Board.boardSize - 2, Board.boardSize + 2, -Board.boardSize - 2, -Board.boardSize + 2, Board.boardSize + Board.boardSize - 1, Board.boardSize + Board.boardSize + 1, -Board.boardSize - Board.boardSize - 1, -Board.boardSize - Board.boardSize + 1]
    static slidingOffsets = [Board.boardSize, -Board.boardSize, -1, 1, Board.boardSize - 1, -Board.boardSize + 1, Board.boardSize + 1, -Board.boardSize - 1]
    static pawnSidesOffsets = [Board.boardSize - 1, Board.boardSize + 1, -Board.boardSize - 1, -Board.boardSize + 1]
    
    static difficulty = {easy: 20, normal: 10, hard: 1, reallyHard: 0.1, impossible: -1}


    constructor() {

        this.level = 20

        this.checkMoves = []
        this.allMoves = []
        this.lastPiece = 0
        this.lastMove = { startSquare: 0, targetSquare: 0, piece: 0 }
        this.randomBot = new Bot()
        this.stockfish = new stockfish()
        this.rotationLerp = 0
        this.tLerp = false;
        this.generateMoveOnceBot = false
        
        this.moves = []

        this.lastMousePosBeforePress = 0
        this.currentPiece = 0
        this.pressed = false;
        // king moved = 0 no one moves, kingMoved = 1 white moved, kingMoved = 2 blackMoved, kingMoved = 3 both moved
        this.kingMoved = 0
        // WHITE: [0] left most rook, [1] right most rook, BLACK: [2] left most rook, [3] right most rook
        this.rooksMoved = [false, false, false, false]
    }

    movePieces(pieces) {

        for (let i = 0; i < Board.boardSize * Board.boardSize; i++) {
            // Calculate the x and y position of the square based on the current iteration
            let x = (i % Board.boardSize) * Board.distance;
            let y = Math.floor(i / Board.boardSize) * Board.distance;

            if (mouseX >= x && mouseX <= ((x / Board.distance) + 1) * Board.distance && mouseY >= y && mouseY <= (y / Board.distance + 1) * Board.distance) {
                if (mouseIsPressed) {
                    if (Board.Squares[i].piece != 0 && !this.pressed) {
                        // save the piece
                        this.lastPiece = Board.Squares[i]
                        this.currentPiece = Board.Squares[i].piece;
                        this.lastMousePosBeforePress = i;
                        // remove piece
                        // Board.Squares[i].piece = 0
                        
                        
                        
                    }
                    this.pressed = true
                    
                }
                else {
                    let canMakeMove = false
                    // this.kingChecked()
                    if (this.pressed && this.currentPiece != 0) {
                        this.rotationLerp = 0;
                        for (let move = 0; move < this.moves.length; move++) {
                            // check for every move in moves that the start square is the same as the piece
                            if (this.moves[move].startSquare == this.lastMousePosBeforePress) {
                                // check if the move your trying to do is valid
                                if (this.moves[move].targetSquare == i) {
                                    canMakeMove = true;
                                    // stopLerping = false
                                    break;
                                }
                            }
                            canMakeMove = false;
                            // if there is no break bring back to where it used to be
                        }
                        if (canMakeMove == false && this.lastMousePosBeforePress > -1) {
                            // return to last place
                            Board.Squares[this.lastMousePosBeforePress].piece = this.currentPiece;
                            this.lastMousePosBeforePress = -1
                            
                        }
                    }
                    if(canMakeMove){
                        
                        this.movePiece(i, this.lastMousePosBeforePress, this.currentPiece);
                        this.checkMate();
                    }
                    // castle
                    this.castle(this.lastMove)
                    
                    this.pressed = false
                    
                    
                    
                    
                    
                }
                push();
                // make to rotate to sides
                translate(mouseX, mouseY)
                this.rotationLerp = max(min(lerp(this.rotationLerp, (mouseX - pmouseX) * 4, 0.5), 90), -90)
                rotate(this.rotationLerp)
                Board.drawPiece({ piece: this.currentPiece }, 0, 0)
                pop();
                
            }
            
            if (this.pressed == false) {
                this.currentPiece = 0
            }
            
            
            
            
        }
        
        // if(Board.turn == Pieces.Black && this.level > 0)
        //     this.makeBotMove(this.level) // more = worst
        // else if (Board.turn == Pieces.Black && this.level < 0){
        //     const move = this.randomBot.makeMove(this.moves)
        //     print(move)
        //     this.movePiece(move.targetSquare, move.startSquare, move.piece)
        // }
        // print(Board.generateFenPosition());
        if (mouseIsPressed) {
            this.drawMoves(this.lastMousePosBeforePress, this.lastPiece.piece);
            
        }
    }

    lerp(move, speed){
        let stopLerping = false
        // lerp
        if (this.tLerp >= 1) {
            stopLerping = true;
            this.tLerp = 0
            return true
        }
        this.tLerp += 0.009 * deltaTime * speed
        this.tLerp = min(1, this.tLerp)
        this.drawSquaresOnMove(move);
        if (!stopLerping) {
            Board.drawPiece(move.piece, Quality.lerp(move, this.tLerp).x * Board.distance + Board.distance / 2, Quality.lerp(move, this.tLerp).y * Board.distance + Board.distance / 2)
            return false
        }
    }

    drawSquaresOnMove(move, doStart = 0){
        // do start = 0 draw both
        // do start = 1 draw only start
        // do start = 2 draw only end
        const x = Board.Squares[move.startSquare].x
        const y = Board.Squares[move.startSquare].y
        const targetX = Board.Squares[move.targetSquare].x
        const targetY = Board.Squares[move.targetSquare].y
        push();

        // taken from Board.drawSquares() /======================================================/
        if(doStart == 0 || doStart == 1){
            if ((y + x) % 2 != 0) {
                fill('rgb(119, 153, 82)');
            } else {
                fill('rgb(237, 238, 209)');
            }
    
            // Draw the square using the x and y position
            square(x * Board.distance, y * Board.distance, Board.distance);
            textStyle(BOLD);
            if ((y + x) % 2 == 0) {
                fill('rgb(119, 153, 82)');
            } else {
                fill('rgb(237, 238, 209)');
            }
            if (x == 0) {
    
                text((8 - y).toString(), (x) * Board.distance, y * Board.distance - 2 + 15)
            }
            if (y + 1 == Board.boardSize) {
                const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
                text(letters[(x)], x * Board.distance + Board.distance - 8, y * Board.distance + Board.distance - 2)
            }
            //=========================================================================//

        }

        // taken from Board.drawSquares() /======================================================/
        if (doStart == 0 || doStart == 2) {

            if ((targetY + targetX) % 2 != 0) {
                fill('rgb(119, 153, 82)');
            } else {
                fill('rgb(237, 238, 209)');
            }

            // Draw the square using the x and y position
            square(targetX * Board.distance, targetY * Board.distance, Board.distance);
            textStyle(BOLD);
            if ((targetY + targetX) % 2 == 0) {
                fill('rgb(119, 153, 82)');
            } else {
                fill('rgb(237, 238, 209)');
            }
            if (targetX == 0) {

                text((8 - targetY).toString(), (targetX) * Board.distance, targetY * Board.distance - 2 + 15)
            }
            if (targetY + 1 == Board.boardSize) {
                const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
                text(letters[(targetX)], targetX * Board.distance + Board.distance - 8, targetY * Board.distance + Board.distance - 2)
            }
        }
        //=========================================================================//

        pop();
    }

    makeBotMove(howGood){
        // if (Board.turn == Pieces.Black) {
        if(!this.generateMoveOnceBot){
            this.stockfish.start(Board.generateFenPosition(), howGood)
            this.generateMoveOnceBot = true;
        }
            
        if (this.stockfish.bestMove !== undefined) {
            const makeMove = Board.convertAlgebraicExpression(this.stockfish.bestMove)
            if (Board.convertAlgebraicExpression(this.stockfish.bestMove) != this.stockfish.bestMove && Board.Squares[makeMove.startSquare].piece != 0) {
                const piece = Board.Squares[Board.convertAlgebraicExpression(this.stockfish.bestMove).startSquare].piece;
                if (this.lerp(makeMove, 2)) {
                    Board.drawPiece(makeMove.piece, Board.Squares[makeMove.targetSquare].x * Board.distance + Board.distance / 2, Board.Squares[makeMove.targetSquare].y * Board.distance + Board.distance / 2)
                    this.movePiece(makeMove.targetSquare, makeMove.startSquare, piece)
                    this.drawSquaresOnMove(makeMove, 1);
                    this.stockfish.bestMove = undefined
                    this.generateMoveOnceBot = false;
                }
            }
        }

    }


    movePiece(targetPosition, startPosition, currentPiece) {
        this.lastMove.startSquare = startPosition
        Board.Squares[targetPosition].piece = currentPiece;
        
        this.lastMove.targetSquare = targetPosition
        this.lastMove.piece = currentPiece
        Board.turn = Pieces.oppositeColor({ piece: Board.turn });
        this.unpleasant();
        this.lastMousePosBeforePress = -1
        Board.Squares[startPosition].piece = 0;
        let ls = {...this.lastMove}
        this.allMoves.push(ls);
        this.moves = this.generateMoves().legalMoves
        this.checkMoves = this.generateMoves().checkMoves
        // console.log(Board.turn == Pieces.White ? "White Move:" : "Black Move:", this.lastMove)
    }

    unpleasant() {
        for (let j = 0; j < Board.Squares.length; j++) {
            const xyToI = Board.Squares[j].y * Board.boardSize + Board.Squares[j].x
            const typePawn = Pieces.isType(Board.Squares[j], Pieces.Pawn);
            const turnWhite = Board.turn == Pieces.White
            

            // if is pawn
            if (typePawn && Pieces.isColor(Board.Squares[j], Pieces.White) && !turnWhite) {
                // if has pawn behind
                if (Board.Squares[j + Board.boardSize] !== undefined && Pieces.isType(Board.Squares[j + Board.boardSize], Pieces.Pawn) && Pieces.isColor(Board.Squares[j + Board.boardSize], Pieces.Black) && this.allMoves.length > 0 ? Pieces.isType(this.allMoves[this.allMoves.length - 2], Pieces.Pawn) : false) {
                    Board.Squares[j + Board.boardSize].piece = 0
                }
            } else if (typePawn && Pieces.isColor(Board.Squares[j], Pieces.Black) && turnWhite) {
                if (Board.Squares[j - Board.boardSize] !== undefined && Pieces.isType(Board.Squares[j - Board.boardSize], Pieces.Pawn) && Pieces.isColor(Board.Squares[j - Board.boardSize], Pieces.White) && this.allMoves.length > 0 ? Pieces.isType(this.allMoves[this.allMoves.length - 2], Pieces.Pawn) : false) {
                    Board.Squares[j - Board.boardSize].piece = 0

                }

            }
        }
    }

    // find the check
    // find every move that stops this check
    // 

    legalMoves(moves, checkMoves) {
        let localLegalMoves = []
        for (let i = 0; i < checkMoves.length; i++) {
            const move = checkMoves[i];
            // if (!this.kingChecked(checkMoves).isChecked){
            //     return moves
            // }
            // if (this.kingChecked(checkMoves).whoCheck.startSquare == checkMoves[i].startSquare) {
                // if you found it check for every move this piece can make
                for (let j = 0; j < checkMoves.length; j++) {
                    // checks if the current piece is equal to the piece we found
                    if (move.startSquare == checkMoves[j].startSquare) {
                        // loop over all of the moves we can make
                        for (let k = 0; k < moves.length; k++) {
                            // check if the we have a piece that can intercept a move of the checking piece
                            const piece = Board.Squares[moves[k].startSquare].piece
                            const targetPiece = Board.Squares[moves[k].targetSquare].piece
                            Board.Squares[moves[k].startSquare].piece = 0
                            Board.Squares[moves[k].targetSquare].piece = piece
                            let newMoves = this.generateMoves(false).checkMoves
                            // print("start square", moves[k].startSquare)
                            // print("end square", moves[k].targetSquare)
                            // print("king checked", !this.kingChecked(newMoves).isChecked)
                            
                            // check if said move stops the check.
                            if (!this.kingChecked(newMoves).isChecked) {
                                localLegalMoves.push(moves[k])
                            }
                            
                            Board.Squares[moves[k].startSquare].piece = piece
                            Board.Squares[moves[k].targetSquare].piece = targetPiece
                            


                        }
                        break;
                    }

                }
                break;

            // }

        }
        return localLegalMoves
    }


    kingChecked(checkMoveArray) {

        // find if the king is in check. DONE
        // let the player make a move.
        // if move doesn't stop the check go back
        // else allow move
        // find if the king who's turn was last has a move on him.

        // console.log(this.checkMoves)
        for (let i = 0; i < checkMoveArray.length; i++) {
            const move = checkMoveArray[i];
            // const lastTurn = Pieces.oppositeColor({piece: (Board.turn)})
            const lastTurn = (Board.turn)
            const lastTurnKing = (lastTurn == Pieces.White) ? this.findKings().whiteKing : this.findKings().blackKing;

            if (move.targetSquare == lastTurnKing) {
                return { isChecked: true, whoCheck: move }

            }
        }
        return { isChecked: false, whoCheck: -1 }
    }

    checkMate() {
        let kingPlace = 0
        // check if king is in checkmate
        // if king is in checkmate search for take for the threat
        for (let i = 0; i < Board.Squares.length; i++) {
            const element = Board.Squares[i];
            if (Pieces.isType(element, Pieces.King) && Pieces.isColor(element, Board.turn)) {
                kingPlace = i;
                break;
            }
        }

        let isCheckMated = false
        // console.log(this.generateKingMoves(kingPlace, Board.Squares[kingPlace]))
        if (this.kingChecked(this.checkMoves).isChecked && this.generateKingMoves(kingPlace, Board.Squares[kingPlace]).length == 0) {
            for (let i = 0; i < this.moves.length; i++) {
                const move = this.moves[i];
                if (this.kingChecked(this.checkMoves).whoCheck.startSquare == move.targetSquare) {
                    // console.log(this.kingChecked(this.checkMoves).whoCheck.startSquare);
                    isCheckMated = false;
                    break;
                } else {
                    isCheckMated = true;

                }

            }
            if (isCheckMated) {
                console.log('this.checkMate')

            }
        }
    }

    // generateUnCheckedMoves(){

    // }

    findKings() {
        let kingWhitePos = 0
        let kingBlackPos = 0
        for (let i = 0; i < Board.Squares.length; i++) {
            if (Pieces.isType(Board.Squares[i], Pieces.King) && Pieces.isColor(Board.Squares[i], Pieces.White)) {
                kingWhitePos = i
            }
            if (Pieces.isType(Board.Squares[i], Pieces.King) && Pieces.isColor(Board.Squares[i], Pieces.Black)) {
                kingBlackPos = i
            }
            // console.log(i)
        }

        // console.log({ whiteKing:  kingWhitePos, blackKing: kingBlackPos })


        return { whiteKing: kingWhitePos, blackKing: kingBlackPos }
    }


    drawMoves(startSquare, lastPiece) {
        // this square's moves
        let squareMoves = []

        if(startSquare === undefined || startSquare < 0 || lastPiece === undefined){
            return
        }


        for (let i = 0; i < this.moves.length; i++) {
            const move = this.moves[i];

            if (move.startSquare == startSquare) {
                let newMove = move;
                squareMoves.push(newMove);
                // console.log(squareMoves)
            }
        }
        for (let j = 0; j < squareMoves.length; j++) {
            const move2 = squareMoves[j];
            const x = move2.targetSquare % Board.boardSize;
            const y = Math.floor((move2.targetSquare / Board.boardSize));

            // stroke('rgba(150,150,150,150)')
            // console.log(Board.Squares[move2.targetSquare])
            if (Pieces.isColor(Board.Squares[move2.targetSquare], Pieces.oppositeColor({ piece: lastPiece }))) {
                push();
                fill(100, 100, 100, 0)
                stroke(100, 100, 100, 100)
                strokeWeight(5)
                circle(x * Board.distance + Board.distance / 2, y * Board.distance + Board.distance / 2, Board.distance / 1.1);
                pop();

            }
            else {
                push();
                fill(100, 100, 100, 100)
                circle(x * Board.distance + Board.distance / 2, y * Board.distance + Board.distance / 2, Board.distance / 3);
                pop();
            }
            // console.log(`x: ${x} y: ${y}`)

        }


    }


    static calculateMoves() {

        let squaresToEdge = []

        for (let rank = 0; rank < Board.boardSize; rank++) {
            for (let file = 0; file < Board.boardSize; file++) {

                // board size = 8
                // 8 - 1 = 7 (array max index)
                // rank = 7 (1) 7 - 7 = 0

                const squaresUp = (Board.boardSize - 1) - rank;
                const squaresDown = rank;
                const squaresRight = file
                const squaresLeft = (Board.boardSize - 1) - file



                squaresToEdge.push([
                    squaresUp,
                    squaresDown,
                    squaresRight,
                    squaresLeft,

                    Math.min(squaresUp, squaresRight),
                    Math.min(squaresDown, squaresLeft),
                    Math.min(squaresUp, squaresLeft),
                    Math.min(squaresDown, squaresRight),

                ])
            }
        }
        return squaresToEdge
    }

    generateMoves(generateLegalMoves = true) {

        let moves = []
        let checkMoves = []
        let legalMoves = []
        let kingPlace = -1
        let oppositeKingPlace = -1

        for (let startSquare = 0; startSquare < Board.boardSize * Board.boardSize; startSquare++) {
            const piece = Board.Squares[startSquare];
            if (Pieces.isColor(piece, Board.turn)) {

                if (Pieces.isSlidingPiece(piece.piece)) {
                    moves.push(...this.generateSlidingMoves(startSquare, piece));
                }
                else if (Pieces.isType(piece, Pieces.Knight)) {
                    moves.push(...this.generateKnightMoves(startSquare))
                }
                else if (Pieces.isType(piece, Pieces.Pawn)) {
                    moves.push(...this.pawnMoves(startSquare, piece))
                }
                if (Pieces.isType(piece, Pieces.King)) {
                    kingPlace = startSquare;
                    
                    
                }
                // console.log(this.moves)
                
            }
            
        }
        
        
        for (let startSquareOpposite = 0; startSquareOpposite < Board.boardSize * Board.boardSize; startSquareOpposite++) {
            const piece = Board.Squares[startSquareOpposite];
            if (Pieces.isColor(piece, Pieces.oppositeColor({ piece: Board.turn }))) {
                
                if (Pieces.isSlidingPiece(piece.piece)) {
                    checkMoves.push(...this.generateSlidingMoves(startSquareOpposite, piece, true));
                }
                else if (Pieces.isType(piece, Pieces.Knight)) {
                    checkMoves.push(...this.generateKnightMoves(startSquareOpposite, true))
                }
                else if (Pieces.isType(piece, Pieces.Pawn)) {
                    checkMoves.push(...this.pawnMoves(startSquareOpposite, piece, true))
                }
                if (Pieces.isType(piece, Pieces.King)) {
                    oppositeKingPlace = startSquareOpposite;
                    
                }
                // console.log(this.checkMoves)
            }
        }
        if (oppositeKingPlace >= 0 && Pieces.isColor(Board.Squares[oppositeKingPlace], Pieces.oppositeColor({ piece: Board.turn }))) {
            checkMoves.push(...this.generateKingMoves(oppositeKingPlace, Board.Squares[oppositeKingPlace]))           
        }
        oppositeKingPlace = -1
        if (kingPlace >= 0 && Pieces.isColor(Board.Squares[kingPlace], Board.turn)) {
            moves.push(...this.generateKingMoves(kingPlace, Board.Squares[kingPlace]))
        }
        
        if (generateLegalMoves) {
            legalMoves = this.legalMoves(moves, checkMoves);
            // legalMoves.push(...this.generateKingMoves(kingPlace, Board.Squares[kingPlace]));
            Moves.legalMoves = legalMoves;
            // console.log(legalMoves)
            return { moves: moves, checkMoves: checkMoves, legalMoves: legalMoves }
        }
        kingPlace = -1
        
        return { moves: moves, checkMoves: checkMoves, legalMoves: legalMoves }

    }

    // Queen Bishop Rook
    generateSlidingMoves(startSquare, piece, canTakeFriend) {

        let moveArray = []

        const startDirIndex = (Pieces.isType(piece, Pieces.Bishop)) ? 4 : 0;
        const endDirIndex = (Pieces.isType(piece, Pieces.Rook)) ? 4 : 8;


        // direction index,
        for (let directionIndex = startDirIndex; directionIndex < endDirIndex; directionIndex++) {
            for (let n = 0; n < Moves.numSquaresToEdge[startSquare][directionIndex]; n++) {
                const targetSquare = startSquare + Moves.slidingOffsets[directionIndex] * (n + 1);
                const pieceOnTargetSquare = Board.Squares[targetSquare];

                // Blocked by friendly piece
                if (pieceOnTargetSquare === undefined) {
                    break;
                }
                if (Pieces.isColor(pieceOnTargetSquare, Pieces.getColor(piece)) && !canTakeFriend) {
                    break;
                }
                moveArray.push(...[{ startSquare: startSquare, targetSquare: targetSquare }])

                //cant move any further in this direction after capturing
                if (Pieces.isColor(pieceOnTargetSquare, Pieces.oppositeColor(piece)) /*|| (Pieces.isType(pieceOnTargetSquare, Pieces.King) || Pieces.isColor(pieceOnTargetSquare, Pieces.getColor(piece)))*/) {
                    break;
                }
            }

        }
        return moveArray;
    }

    generateKnightMoves(startSquare, canTakeFriend) {

        let moveArray = []

        for (let dir = 0; dir < 8; dir++) {

            const targetSquare = startSquare + Moves.knightPositions[dir]
            const pieceOnTargetSquare = Board.Squares[targetSquare];
            if (pieceOnTargetSquare !== undefined) {
                if (Pieces.isColor(pieceOnTargetSquare, Pieces.getColor(Board.Squares[startSquare])) && !canTakeFriend) {
                    continue;
                }
                if (Board.manhattanDistance(pieceOnTargetSquare.x, pieceOnTargetSquare.y, Board.Squares[startSquare].x, Board.Squares[startSquare].y) == 3) {
                    moveArray.push(...[{ startSquare: startSquare, targetSquare: targetSquare }])

                }
            }
        }
        return moveArray
    }

    //  --The king has not previously moved;
    //  --Your chosen rook has not previously moved;
    //  --There must be no pieces between the king and the chosen rook;
    //  --The king is not currently in check;
    //  --Your king must not pass through a square that is under attack by enemy pieces;
    //  --The king must not end up in check.

    updateCanCastle() {
        let rooksMoved = [true, true, true, true]
        for (let i = 0; i < Board.Squares.length; i++) {
            const square = Board.Squares[i];
            // if king has not moved
            if (square.piece == Pieces.King) {
                if (Board.turn == Pieces.White && this.kingMoved == 0) {
                    this.kingMoved = 1
                }
                else if (Board.turn == Pieces.Black && this.kingMoved == 0) {
                    this.kingMoved = 2
                }
                else if (this.kingMoved > 0) {
                    this.kingMoved = 3
                }
            }
            // if the castle rook has not moved
            if (Pieces.isType(square, Pieces.Rook)) {

                if (i == 56) {
                    rooksMoved[0] = false
                }
                if (i == 63) {
                    rooksMoved[1] = false
                }
                if (i == 0) {
                    rooksMoved[2] = false
                }
                if (i == 7) {
                    rooksMoved[3] = false

                }

            }

        }
        return rooksMoved

    }

    canCastle() {

        let sidesCastle = [true, true, true, true]

        // if there is no piece in the way
        for (let i = 0; i < Board.Squares.length; i++) {
            const element = Board.Squares[i];
            const elementI = element.y * Board.boardSize + element.x
            if (Board.turn == Pieces.White && (Board.Squares[58].piece != 0 || Board.Squares[59].piece != 0)) {
                sidesCastle[0] = false
            }
            if (Board.turn == Pieces.White && (Board.Squares[61].piece != 0 || Board.Squares[62].piece != 0)) {
                sidesCastle[1] = false

            }
            if (Board.turn == Pieces.Black && (Board.Squares[6].piece != 0 || Board.Squares[5].piece != 0)) {
                sidesCastle[2] = false

            }
            if (Board.turn == Pieces.Black && (Board.Squares[3].piece != 0 || Board.Squares[2].piece != 0)) {
                sidesCastle[3] = false

            }
        }

        // if there is a move on the castle places
        for (let i = 0; i < this.checkMoves.length; i++) {
            const element = this.checkMoves[i];

            if (Board.turn == Pieces.White && (element.targetSquare == 57 || element.targetSquare == 58)) {
                sidesCastle[0] = false
            }
            if (Board.turn == Pieces.White && (element.targetSquare == 60 || element.targetSquare == 61)) {
                sidesCastle[1] = false

            }
            if (Board.turn == Pieces.Black && (element.targetSquare == 3 || element.targetSquare == 5)) {
                sidesCastle[2] = false

            }
            if (Board.turn == Pieces.Black && (element.targetSquare == 1 || element.targetSquare == 2)) {
                sidesCastle[3] = false

            }
        }

        if (this.kingChecked(this.checkMoves).isChecked) {
            sidesCastle = [false, false, false, false];
        }

        return sidesCastle;

    }

    castle(lastMove){
        if (Pieces.isType(this.lastMove, Pieces.King)) {
            if (lastMove.startSquare == 60 && lastMove.targetSquare == 62) {
                Board.Squares[lastMove.targetSquare - 1].piece = Pieces.Rook | Pieces.White
                Board.Squares[63].piece = 0
            } else if (lastMove.startSquare == 60 && lastMove.targetSquare == 58) {
                Board.Squares[lastMove.targetSquare + 1].piece = Pieces.Rook | Pieces.White
                Board.Squares[56].piece = 0

            } else if (lastMove.startSquare == 4 && lastMove.targetSquare == 6) {
                Board.Squares[lastMove.targetSquare - 1].piece = Pieces.Rook | Pieces.Black
                Board.Squares[7].piece = 0

            }
            else if (lastMove.startSquare == 4 && lastMove.targetSquare == 2) {
                Board.Squares[lastMove.targetSquare + 1].piece = Pieces.Rook | Pieces.Black
                Board.Squares[0].piece = 0

            }

        }
    }

    generateKingMoves(startSquare, piece) {

        let moveArray = []


        for (let i = 0; i < Moves.slidingOffsets.length; i++) {
            const targetSquare = startSquare + Moves.slidingOffsets[i];
            const pieceOnTargetSquare = Board.Squares[targetSquare];
            let overLappingMoves = []

            if (pieceOnTargetSquare === undefined) {
                continue;
            }
            // Blocked by friendly piece
            if (Pieces.isColor(pieceOnTargetSquare, Pieces.getColor(piece))) {
                continue;
            }

            // check if the move is less than or equal to 3
            if (Board.manhattanDistance(pieceOnTargetSquare.x, pieceOnTargetSquare.y, Board.Squares[startSquare].x, Board.Squares[startSquare].y) >= 3) {
                // console.log("x:", pieceOnTargetSquare, Board.Squares[startSquare])//, "y:", pieceOnTargetSquare.y, Board.Squares[startSquare].y)
                // console.log("distance: " + Board.manhattanDistance(pieceOnTargetSquare.x, pieceOnTargetSquare.y, Board.Squares[startSquare].x, Board.Squares[startSquare].y), "target square: " + targetSquare, "start square: " + startSquare)
                continue;
            }

            // check for all of the moves on the board
            // find if some of the over lap the king's moves
            // dont add that move
            // TODO: there is bug here the king takes into considartion his own friend's moves
            // for (let i = 0; i < this.checkMoves.length; i++) {
            //     const move = this.checkMoves[i];
            //     if (move.targetSquare == targetSquare) {
            //         overLappingMoves.push(move);
            //         print(overLappingMoves);
            //         break;
            //     }

            // }
            // if (overLappingMoves.length > 0) {
            //     moveArray = moveArray.filter(item => overLappingMoves.includes(item));
            //     continue;
            // }
            moveArray.push(...[{ startSquare: startSquare, targetSquare: targetSquare }])


        }
        if (Board.turn == Pieces.White) {
            if (!this.updateCanCastle()[0] && this.canCastle()[0]) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare - 2 }])

            }
            if (!this.updateCanCastle()[1] && this.canCastle()[1]) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare + 2 }])

            }

        } else if (Board.turn == Pieces.Black) {
            if (!this.updateCanCastle()[2] && this.canCastle()[2]) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare - 2 }])

            }
            if (!this.updateCanCastle()[3] && this.canCastle()[3]) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare + 2 }])

            }

        }

        return moveArray

    }


    pawnMoves(startSquare, piece, canTakeFriend) {

        let moveArray = []


        const firstRow = (this.whichRow(piece) == Board.boardSize - 2) || (this.whichRow(piece) == 1);
        const targetSquare = startSquare + (Pieces.isColor(piece, Pieces.White) ? -Board.boardSize : Board.boardSize)
        const pieceOnTargetSquare = Board.Squares[targetSquare];
        const doubleMove = startSquare + (Pieces.isColor(piece, Pieces.White) ? -(Board.boardSize * 2) : Board.boardSize * 2);
        const pieceOnDoubleMoveSquare = Board.Squares[doubleMove];


        if (pieceOnTargetSquare === undefined) {
            Board.Squares[startSquare].piece = Pieces.getColor(piece) | Pieces.Queen
            return moveArray
        }
        // check for takes
        const startIndex = (Pieces.isColor(piece, Pieces.White)) ? 2 : 0
        const endIndex = (Pieces.isColor(piece, Pieces.White)) ? 4 : 2
        for (let sideIndex = startIndex; sideIndex < endIndex; sideIndex++) {
            const targetPiece = Board.Squares[startSquare + Moves.pawnSidesOffsets[sideIndex]];
            if (targetPiece !== undefined && Pieces.isColor(targetPiece, Pieces.oppositeColor(piece)) && Board.manhattanDistance(Board.Squares[startSquare].x, Board.Squares[startSquare].y, targetPiece.x, targetPiece.y) < 3) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare + Moves.pawnSidesOffsets[sideIndex] }])
            }

        }



        if (Pieces.isColor(pieceOnTargetSquare, Pieces.getColor(piece)) && !canTakeFriend) {
            return moveArray;
        }
        if (Board.Squares[targetSquare].piece != Pieces.None) {
            return moveArray
        }

        moveArray.push(...[{ startSquare: startSquare, targetSquare: targetSquare }])

        // console.log( "pawn: ", "turn: " + Board.turn, "square:", Board.Squares[startSquare + (Pieces.isColor(piece, Pieces.White) ? -(Board.boardSize * 2) : Board.boardSize * 2)])
        if (Board.Squares[startSquare + (Pieces.isColor(piece, Pieces.White) ? -(Board.boardSize * 2) : Board.boardSize * 2)] === undefined || Pieces.isColor(Board.Squares[startSquare + (Pieces.isColor(piece, Pieces.White) ? -(Board.boardSize * 2) : Board.boardSize * 2)], Pieces.getColor(piece))) {
            return moveArray;
        }
        if (firstRow && Board.Squares[doubleMove].piece == Pieces.None) {
            moveArray.push(...[{ startSquare: startSquare, targetSquare: doubleMove }])
        }
        // anpesant
        if (Pieces.isColor(piece, Pieces.Black)) {
            if (Pieces.isColor(Board.Squares[startSquare + 1], Pieces.oppositeColor(piece)) && this.whichRow(piece) == 4 && this.allMoves.length > 0 ? Pieces.isType(this.allMoves[this.allMoves.length - 1], Pieces.Pawn) : false) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare + Board.boardSize + 1 }])
                
            }
            if (Pieces.isColor(Board.Squares[startSquare - 1], Pieces.oppositeColor(piece)) && this.whichRow(piece) == 4 && this.allMoves.length > 0 ? Pieces.isType(this.allMoves[this.allMoves.length - 1], Pieces.Pawn) : false) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare + Board.boardSize - 1 }])
                
            }
            
        }
        else if (Pieces.isColor(piece, Pieces.White)) {
            if (Pieces.isColor(Board.Squares[startSquare + 1], Pieces.oppositeColor(piece)) && this.whichRow(piece) == 3 && this.allMoves.length > 0 ? Pieces.isType(this.allMoves[this.allMoves.length - 1], Pieces.Pawn) : false) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare - Board.boardSize + 1 }])
                
            }
            if (Pieces.isColor(Board.Squares[startSquare - 1], Pieces.oppositeColor(piece)) && this.whichRow(piece) == 3 && this.allMoves.length > 0 ? Pieces.isType(this.allMoves[this.allMoves.length - 1], Pieces.Pawn) : false) {
                moveArray.push(...[{ startSquare: startSquare, targetSquare: startSquare - Board.boardSize - 1 }])
            }


        }


        return moveArray
    }



    whichRow(piece) {
        return piece.y
    }

}

