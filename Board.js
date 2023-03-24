class Board{
    static boardSize = 8;
    static turn = 0
    static Squares = []
    static distance = Width / Board.boardSize
    constructor(){


        // this.Pieces = new Pieces();
        Board.Squares = Array.from({ length: Board.boardSize * Board.boardSize }, () => 0);


        // on normal chess bBoard.boardSize = Board.boardSize + 1 is 9 Board.boardSize - 1 is -9

        Board.turn = Pieces.White;

        

        this.moves = []
        this.movesObj = {startSquare: 0, targetSquare: 0};
        
    }

    setSquare(){
        for (let i = 0; i < Board.boardSize * Board.boardSize; i++) {
    
            // Calculate the x and y position of the square based on the current iteration
            let x = i % Board.boardSize;
            let y = Math.floor(i / Board.boardSize);

            // Assign an object to the current element in the Square array
            // The object has properties for the piece and the x and y position of the square
            Board.Squares[i] = { piece: Board.Squares[i], x: x, y: y};
        }

    }
    
    drawSquareOutline(x,y) {
        push();
        stroke("White")
        fill(0, 0, 0, 0)
        square(x * Board.distance + Board.distance / 2, y * Board.distance + Board.distance / 2, Board.distance)
        pop();
    }
    
    drawSquares() {
        // This is a for loop that iterates over all elements in the Square array
        for (let i = 0; i < Board.boardSize * Board.boardSize; i++) {

            // Calculate the x and y position of the square based on the current iteration
            let x = i % Board.boardSize;
            let y = Math.abs(Math.floor((i / Board.boardSize)));


            // Fill the square with a light color if (x + y) % 2 is equal to 0
            // Fill the square with a dark color otherwise
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
            if(x == 0){

                text((8 - y).toString(), (x) * Board.distance, y * Board.distance - 2 + 15)
            }
            if(y + 1 == Board.boardSize){
                const letters = ["a","b","c","d","e","f","g","h"]
                text(letters[(x)], x * Board.distance + Board.distance - 8, y * Board.distance + Board.distance - 2)
            }
            // text(i, x * Board.distance, y * Board.distance + Board.distance)        
        }

    }



    static manhattanDistance(x1, y1, x2, y2){
        return abs(x1 - x2) + abs(y1 - y2)
    }
    

    
    static drawPiece(piece, x, y)
    {
        let PieceScale = 0.8

        // print(`piece: ${(piece.piece).toString(2)} x:  ${x} y: ${y}`)
        if (piece.piece.toString(2).length == 4) {
            if ((piece.piece & 0b00111) == 1) {
                image(Images.WhiteKing, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            }
            else if ((piece.piece & 0b00111) == 2) {
                image(Images.WhitePawn, x, y, width * 0.08 * PieceScale, height * 0.1 * PieceScale)
            }
            else if ((piece.piece & 0b00111) == 3) {
                image(Images.WhiteKnight, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            }
            else if ((piece.piece & 0b00111) == 4) {
                image(Images.WhiteBishop, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            }
            else if ((piece.piece & 0b00111) == 5) {
                image(Images.WhiteRook, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            }
            else if ((piece.piece & 0b00111) == 6) {
                image(Images.WhiteQueen, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                
            }
            
        }
        if (piece.piece.toString(2).length >= 5) {
            if ((piece.piece & 0b00111) == 1)
                image(Images.BlackKing, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            else if ((piece.piece & 0b00111) == 2)
                image(Images.BlackPawn, x, y, width * 0.08 * PieceScale, height * 0.1 * PieceScale)
            else if ((piece.piece & 0b00111) == 3)
                image(Images.BlackKnight, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            else if ((piece.piece & 0b00111) == 4)
                image(Images.BlackBishop, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            else if ((piece.piece & 0b00111) == 5)
                image(Images.BlackRook, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            else if ((piece.piece & 0b00111) == 6)
                image(Images.BlackQueen, x, y, width * 0.1 * PieceScale, height * 0.1 * PieceScale)
        }
    }

    // draw the moved piece
    // take the start place of the piece
    // take the end place of the piece
    // lerp between them
    drawLerp(lastMove, startMilliseconds){
        Quality.lerp(lastMove, max(millis() / 1000, 1));
    }

    drawPieces(){
        let PieceScale = 0.8



        for(let i = 0; i < Board.Squares.length; i++){
            const element = Board.Squares[i];

            if (element.piece.toString(2).length == 4) {
                
                if ((element.piece & 0b00111) == 1) {
                    image(Images.WhiteKing, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                }
                else if ((element.piece & 0b00111) == 2) {
                    image(Images.WhitePawn, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.08 * PieceScale, height * 0.1 * PieceScale)
                }
                else if ((element.piece & 0b00111) == 3) {
                    image(Images.WhiteKnight, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                }
                else if ((element.piece & 0b00111) == 4) {
                    image(Images.WhiteBishop, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                }
                else if ((element.piece & 0b00111) == 5) {
                    image(Images.WhiteRook, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                }
                else if ((element.piece & 0b00111) == 6) {
                    image(Images.WhiteQueen, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)

                }

            }
            if (element.piece.toString(2).length >= 5) {
                if ((element.piece & 0b00111) == 1) 
                    image(Images.BlackKing, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                else if ((element.piece & 0b00111) == 2) 
                    image(Images.BlackPawn, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.08 * PieceScale, height * 0.1 * PieceScale)
                else if ((element.piece & 0b00111) == 3) 
                    image(Images.BlackKnight, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                else if ((element.piece & 0b00111) == 4) 
                    image(Images.BlackBishop, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                else if ((element.piece & 0b00111) == 5) 
                    image(Images.BlackRook, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
                else if ((element.piece & 0b00111) == 6) 
                    image(Images.BlackQueen, Board.convertToCanvasPos(element.x), Board.convertToCanvasPos(element.y), width * 0.1 * PieceScale, height * 0.1 * PieceScale)
            }
        }
    }

    
    loadPositionFromFen(fen){
        let file = 0;
        let rank = 0;

        let fenString = fen.split(' ')[0]

        for (let i = 0; i < fenString.length; i++) {
                const symbol = fenString[i];
                
                if(symbol == '/'){
                    file = 0;
                    rank++;
                } else {
                    if(!isNaN(Number(symbol))){
                        file += Number(symbol)
                    } else {
                        const pieceColor = (symbol === symbol.toUpperCase()) ? Pieces.White : Pieces.Black
                        const pieceType = this.FenConvertToPiece(symbol.toLowerCase());
    
                        Board.Squares[rank * 8 + file].piece = pieceColor | pieceType;
                        file++;
                    }
                }
            }
        
    }

    static generateFenPosition(board) {
        let fen = "";
        let empty = 0;
        for (let i = 0; i < Board.Squares.length; i++) {
            const piece = Board.Squares[i];
            if (piece.piece == 0) {
                empty++;
            } else {
                if (empty > 0) {
                    fen += empty.toString();
                    empty = 0;
                }
                fen += this.FenConvertToLetter(piece.piece);
            }
            if (i % 8 === 7) {
                if (empty > 0) {
                    fen += empty.toString();
                    empty = 0;
                }
                if (i !== 63) {
                    fen += "/";
                }
            }
        }
        fen += ` ${Board.turn == Pieces.White ? "w" : "b"}`
        return fen;
    }





    
    
    static FenConvertToLetter(piece){
        if (Pieces.isColor({ piece: piece }, Pieces.White)){
            if (Pieces.isType({piece: piece}, Pieces.King)) return 'K'
            if (Pieces.isType({piece: piece}, Pieces.Bishop)) return 'B'
            if (Pieces.isType({piece: piece}, Pieces.Pawn)) return 'P'
            if (Pieces.isType({piece: piece}, Pieces.Knight)) return 'N'
            if (Pieces.isType({piece: piece}, Pieces.Rook)) return 'R'
            if (Pieces.isType({piece: piece}, Pieces.Queen)) return 'Q'

        }
        else if (Pieces.isColor({ piece: piece }, Pieces.Black)){
            if (Pieces.isType({piece: piece}, Pieces.King)) return 'k'
            if (Pieces.isType({piece: piece}, Pieces.Bishop)) return 'b'
            if (Pieces.isType({piece: piece}, Pieces.Pawn)) return 'p'
            if (Pieces.isType({piece: piece}, Pieces.Knight)) return 'n'
            if (Pieces.isType({piece: piece}, Pieces.Rook)) return 'r'
            if (Pieces.isType({piece: piece}, Pieces.Queen)) return 'q'

        }        
        
    }
    FenConvertToPiece(letter){
        if (letter == 'k') return Pieces.King
        if (letter == 'b') return Pieces.Bishop
        if (letter == 'p') return Pieces.Pawn
        if (letter == 'n') return Pieces.Knight
        if (letter == 'r') return Pieces.Rook
        if (letter == 'q') return Pieces.Queen
        
        
    }
    
    static convertAlgebraicExpression(expression){
        let file = expression.substring(0,2).charCodeAt(0) - 97; // Convert file letter to number (a=0, b=1, c=2, etc.)
        let rank = 8 - parseInt(expression.substring(0, 2).charAt(1)); // Convert rank number to number (1=0, 2=1, 3=2, etc.)
        const startSquare = rank * 8 + file; // Calculate square number between 0 and 63
        file = expression.substring(2,4).charCodeAt(0) - 97; // Convert file letter to number (a=0, b=1, c=2, etc.)
        rank = 8 - parseInt(expression.substring(2, 4).charAt(1)); // Convert rank number to number (1=0, 2=1, 3=2, etc.)
        const targetSquare = rank * 8 + file; // Calculate square number between 0 and 63
        
        return { startSquare, targetSquare, piece: Board.Squares[startSquare] }
    }
    static convertToCanvasPos(num){
        return num * Board.distance + Board.distance / 2 
    }
}