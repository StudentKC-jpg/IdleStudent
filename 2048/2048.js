// todo MAKE LOOK MORE LIKE ACTUAL 2048
/**  
 * in win message how many moves it took you to get 2048
 * an undo button MAYBE
 * score message w/ current score highscore # of moves highest score(based on leaderboards)
 * storage system
 * leaderboards
 * curved borders and tiles
 * slide animations
 * fire symbol for fast connects
*/

var board;
var score = 0;
var highscore = localStorage.getItem("highscore") || 0;
var rows = 4;
var columns = 4;
var counter = 0;
var restart = document.getElementById("restart");
var popUp = document.getElementById("popUp");
// !! currently not working == UNDO button
// var previousState = [];

window.onload = function() {
    setGame();
    updateHighscore();
}

function setGame(){
    board = [
        //regular game
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]

        // test game over and restart
        // [2, 4, 2, 4],
        // [4, 2, 4, 2],
        // [2, 4, 2, 4],
        // [4, 2, 4, 2]

        //test win condition
        // [1024, 1024, 0, 0],
        // [0, 0, 0, 0],
        // [0, 0, 0, 0],
        // [0, 0, 0, 0]

        // for thumbnail
        // [8192, 4096, 2048, 1024],
        // [512, 256, 128, 64],
        // [32, 16, 8, 4],
        // [2, 2, 2, 2]

    ];

    
    //!! previousState = []; UNDO

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // creates a <div></div> tag
            let tile = document.createElement("div");
           
            // set coordinates that correlative to board ie <div id="0-0"></div>
            tile.id = r.toString() + "-" + c.toString();

            // get num on board 
            let num = board[r][c];

            // applies changes based on tile num
            updateTile(tile, num);

            //adds tile div tag to board ie fills board with tiles
            document.getElementById("board").append(tile);
        }
    }

    //creates two tile to start game
    setTwo();
    setTwo();
}

//return true if empty tile
function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
}

// if there's an open tile after movement then this func is called
function setTwo(){
    if(!hasEmptyTile()){ //if you find an empty == true which makes this if == false
        return;
    }


    let found = false;
    while(!found){
        //random r, c
        let r = Math.floor(Math.random() * rows); //Math.random -> between (0,1) * 4 -> (0, 4), Math.floor round down
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
           board[r][c] = 2;
           let tile = document.getElementById(r.toString() + "-" + c.toString()); 
           tile.innerText = "2";
           tile.classList.add("x2");
           found = true;
        }
    }
}

function updateTile(tile, num){
    // clear tile after we slide
    tile.innerText = "";

    // clear classList, don't want a tile to keep old class name
    tile.classList.value = "";

    // add tile back ie empty tile
    tile.classList.add("tile");

    // changes class based on number; keep the css
    if(num > 0){
        tile.innerText = num.toString();
        if(num <= 4096){
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }

}

//update highscore
function updateHighscore(){
    document.getElementById("highscore").innerText = highscore;
}

//!! intended for UNDO currently not working
/*
function saveState(){
    previousState.push(JSON.stringify(board));
}*/

//return true if they are valid moves
function hasValidMove(){
    // check rows for possible moves
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns - 1; c++){
            if(board[r][c] == board[r][c+1]){
                return true;
            }
        }
    }
    
    // check columns for possible moves
    for(let c = 0; c < columns; c++){
        for(let r = 0; r < rows - 1; r++){
            if(board[r][c] == board[r + 1][c]){
                return true;
            }
        }
    }
}

// !! currently not working UNDO
// function undo() {
//     if(previousState.length > 0){
//         board = JSON.parse(previousState.pop());
//         score = previousState.length ? JSON.parse(previousState[previousState.length - 1]).score : 0;
//         updateBoard();
//     }
// }


function updateBoard(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score;
}

// keyboard movement 
document.addEventListener("keyup", move = (e) => {
    // !! save save before move UNDO
    //saveState();

    //game over if no valid moves and no empty tiles
    if(!hasValidMove() && !hasEmptyTile()){
        gameOver();
    }

    if (e.code == "ArrowLeft"){
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight"){
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp"){
        slideUp();
        setTwo();
    }
    else if(e.code == "ArrowDown"){
        slideDown();
        setTwo();
    } else if(e.code == "keyZ"){
        //!! UNDO not working
        //undo();
    }

    document.getElementById("score").innerText = score;
    counter++;
})



restart.addEventListener("click", e => {
    restartGame();
});

function filterZero(row) {
    return row.filter(num => num != 0); // create a new array without zeroes [2 , 0, 2, 0] -> [2, 2,] -> [4, 0, 0, 0]
}

function slide(row) {
    //[0, 2, 2, 2]
    row = filterZero(row); // get rid of zeroes -> [2, 2, 2]
    let winner = false;

    //slide
    for(let i = 0; i < row.length - 1; i++){
        //check every 2 tiles
        if(row[i] == row[i + 1]){
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];

            if (row[i] === 2048) {
                winner = true;
            }

        } // [2, 2, 2] -> [4,0,2]
    }

    row = filterZero(row); //[4, 2]

    //add back zeroes
    while (row.length < columns){
        row.push(0);
    } // [4, 2, 0,0]

    if(winner){
        winGame();
    }

    return row;
}

function slideLeft(){
    for(let r = 0; r < rows; r++){
        let row = board[r];
        row = slide(row);
        board[r] = row;

        // Update html
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// pretty much same as left but in reverse hence the reason i reversed array in function
function slideRight(){
    for(let r = 0; r < rows; r++){
        let row = board[r]; // [2, 2, 2, 0]
        row.reverse(); // [0, 2, 2, 2]
        row = slide(row); // if i go slideLeft [4, 2, 0, 0]
        row.reverse(); // reverse arr -> [0, 0, 2, 4] -> looks like if i slid right
        board[r] = row; 

        // Update rows and columns from html
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//the idea to treat column as a row and then slideUp -> slideLeft
function slideUp(){
    for(let c = 0; c < columns; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row)
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        // Update rows and columns from html
        for(let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//the idea to treat column as a row and then slideDown -> slideRight
function slideDown(){
    for(let c = 0; c < columns; c++){
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row)
        row.reverse();

        // Update rows and columns from html
        for(let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }

    }
}


// resets board
function restartGame(){

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;
        }
    }

    score = 0;
    updateBoard();
    setTwo();
    setTwo();
}

// lost game
function gameOver(){
    if(score > highscore){
        highscore = score;
        localStorage.setItem("highscore", highscore);
    }

    document.getElementById("popUp").style.display = "block";
    document.getElementById("newGame").style.display = "block";
    document.getElementById("newGame").addEventListener("click", e =>{
        
        document.getElementById("popUp").style.display = "none";
        document.getElementById("newGame").style.display = "none";
        restartGame();
        updateHighscore();
    });

    // todo endgame display score and highscore in popup MAYBE
    // document.getElementById("score").innerText = score;
    // document.getElementById("highscore").innerText = highscore;
}

// create 2048
function winGame(){
    document.getElementById("winner").style.display = "flex"; // Show the pop-up
}

// Close button functionality
document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("winner").style.display = "none"; // Hide the pop-up
});