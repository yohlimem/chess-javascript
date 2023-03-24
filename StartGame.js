// Get a NodeList of all input elements
var inputs = document.getElementsByClassName("button");
const startGame = document.getElementById("start-game")
// startGame.dis


// Loop through each input element
for (var i = 0; i < inputs.length; i++) {
    // Add a click event listener to each input element
    inputs[i].addEventListener("click", function (event) {
        startGame.style.display = "block";
        switch (event.target.id) {
        case "easy":
                moves.level = 20
            break;
                
            case "normal":
                    
                moves.level = 10
            break;
        
            case "hard":
                moves.level = 1

            break;
        
            case "hardest":
                moves.level = 0.1

            break;
        
            case "dif":
                moves.level = -1

            break;
        
            default:
                moves.level = -1
            break;
        }
        

        
    });
}

startGame.onclick = () => {
    loop()
    document.getElementsByClassName("start")[0].style.display = "none"
}