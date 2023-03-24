class Quality{
    constructor(){
        this.size = 2
    }
    static lerp(lastMove, t){
        const startX = Board.Squares[lastMove.startSquare].x;
        const startY = Board.Squares[lastMove.startSquare].y;
        const targetX = Board.Squares[lastMove.targetSquare].x;
        const targetY = Board.Squares[lastMove.targetSquare].y;

        return { x: lerp(startX, targetX, t), y: lerp(startY, targetY, t) };
    }

    static feedbackSquares(){
        const ratio = Board.boardSize / Width 
        if (floor(mouseX * ratio) != floor(pmouseX * ratio) || floor(mouseY * ratio) != floor(pmouseY * ratio)){
            this.size = 0
        } else{
            this.size = lerp(this.size, 3, 0.03 * deltaTime)
        }
        push();
        stroke(255,255,255,100)
        strokeWeight(this.size)
        fill(0,0,0,0)
        rectMode(CENTER)
        square(floor(mouseX * ratio) * Board.distance + Board.distance / 2, floor(mouseY * ratio) * Board.distance + Board.distance / 2, Board.distance - this.size)
        pop();
    }
    
    static grab(){
        
        const ratio = Board.boardSize / Width 
        const xyToI = floor(mouseY * ratio) * Board.boardSize + floor(mouseX * ratio)

        // if (Board.Squares[xyToI].piece != Pieces.None && mouseIsPressed){
        // }
        if (xyToI < Board.boardSize - 1 && Board.Squares[xyToI].piece != Pieces.None){
            cursor('grab');
        }
        else{// (Board.Squares[xyToI].piece == Pieces.None && !mouseIsPressed){
            cursor(ARROW)
        }

    }
}