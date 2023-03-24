class Pieces {

    static None = 0;
    static King = 1;
    static Pawn = 2;
    static Knight = 3;
    static Bishop = 4;
    static Rook = 5;
    static Queen = 6;

    static White = 8;
    static Black = 16;
    constructor(){
        
    }


    static isColor(piece, color){
        if (piece.piece == 0) return false
        return piece.piece.toString(2).length == ((color == Pieces.White) ? 4 : 5)
    }
    
    static getColor(piece){
        if (piece.piece.toString(2).length == 4){
            return Pieces.White
        }
        else if (piece.piece.toString(2).length >= 5) {
            return Pieces.Black
            
        }

    }
    
    static oppositeColor(piece){
        if (Pieces.getColor(piece) == Pieces.White){
            return Pieces.Black
        }
        else if (Pieces.getColor(piece) == Pieces.Black){
            return Pieces.White
        }
        else{
            return Pieces.None
        }
    }

    static isSlidingPiece(piece){
        // Queen, Rook, Bishop
        return ((piece & 0b00111) == Pieces.Queen || (piece & 0b00111) == Pieces.Rook || (piece & 0b00111) == Pieces.Bishop) && piece != 0
    }

    static isType(piece, comparePiece){
        return (piece.piece & 0b00111) == comparePiece
    }
}