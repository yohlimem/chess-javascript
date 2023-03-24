const Width = 600
const Height = 600

let pieces = []
let slider;
let togglePress;
let moves
let game
let ratio

let board;
let BlackBishop
let BlackKing
let BlackKnight
let BlackPawn
let BlackQueen
let BlackRook
let WhiteBishop
let WhiteKing
let WhiteKnight
let WhitePawn
let WhiteQueen
let WhiteRook

function preload() {
  BlackBishop = loadImage("./Chess Pices Sprites/Black Bishop.png")
  BlackKing = loadImage("./Chess Pices Sprites/Black King.png")
  BlackKnight = loadImage("./Chess Pices Sprites/Black Knight.png")
  BlackPawn = loadImage("./Chess Pices Sprites/Black Pawn.png")
  BlackQueen = loadImage("./Chess Pices Sprites/Black Queen.png")
  BlackRook = loadImage("./Chess Pices Sprites/Black Rook.png")
  WhiteBishop = loadImage("./Chess Pices Sprites/White Bishop.png")
  WhiteKing = loadImage("./Chess Pices Sprites/White King.png")
  WhiteKnight = loadImage("./Chess Pices Sprites/White Knight.png")
  WhitePawn = loadImage("./Chess Pices Sprites/White Pawn.png")
  WhiteQueen = loadImage("./Chess Pices Sprites/White Queen.png")
  WhiteRook = loadImage("./Chess Pices Sprites/White Rook.png")


}

let worker = new Worker("EndGame.js")
function setup() {
  
  noLoop()
  angleMode(DEGREES)
  randomSeed(80)


  Images.BlackBishop = BlackBishop
  Images.BlackKing = BlackKing
  Images.BlackKnight = BlackKnight
  Images.BlackPawn = BlackPawn
  Images.BlackQueen = BlackQueen
  Images.BlackRook = BlackRook
  Images.WhiteBishop = WhiteBishop
  Images.WhiteKing = WhiteKing
  Images.WhiteKnight = WhiteKnight
  Images.WhitePawn = WhitePawn
  Images.WhiteQueen = WhiteQueen
  Images.WhiteRook = WhiteRook
  frameRate(60)
  smooth();
  imageMode(CENTER);
  board = new Board();
  moves = new Moves();
  game = new Game();
  createCanvas(Width, Height);
  stroke(0, 0, 0, 0)
  board.setSquare()
  // board.loadPositionFromFen("K6k/8/8/8Q/8/8/4q3/8")
  // board.loadPositionFromFen("K6k/8/8/8Q/8/8/43/8")
  // board.loadPositionFromFen("K6/4k4/8/8Q/8/8/4q3/8")
  // board.loadPositionFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  // TODO fix bug where you queen is in pin and cannot move
  board.loadPositionFromFen("rnb1qbnr/1p2pkpp/3p4/p1p5/3PQ3/8/PPP2PPP/RNB1KBNR b")
  // Board.turn = 16
  // board.loadPositionFromFen("4k2r/8/8/8/8/8/8/R3K2 w KQkq - 0 1")
  // board.loadPositionFromFen("4r2k/8/8/8/3Q4/8/8/R3K2 w KQkq - 0 1")
  // board.loadPositionFromFen("k/1p8/8/8/8/8/P8/K w KQkq - 0 1")
  // board.loadPositionFromFen("4r2k/8/8/8/3Q4/8/8/R3K2r w KQkq - 0 1")
  moves.moves = moves.generateMoves().legalMoves
  moves.checkMoves = moves.generateMoves().checkMoves



}

function draw() {
  print(moves.level)
  board.drawSquares()
  board.drawPieces()
  moves.movePieces();
  Quality.feedbackSquares()
  Quality.grab()
  push();
  stroke("black")
  fill("White")
  const won = game.win(moves.moves, moves.kingChecked(moves.checkMoves).isChecked, moves.allMoves);
  if (won.white && !won.black){
    worker.postMessage("white lost")
    console.log("YOU LOOSE!")
    print(moves.allMoves)
    text("loser", 200, 200)
    noLoop()
  }
  if (!won.white && won.black){
    worker.postMessage("white won")
    console.log("YOU WIN!")
    print(moves.allMoves)
    text("winner winner chicken dinner", 200, 200)
    noLoop()
  }
  if (!won.white && !won.black){
    worker.postMessage("white won")
    console.log("YOU WIN!")
    text("I guess you win", 200, 200)
    noLoop()
    
  }
  pop();

  
  
}


