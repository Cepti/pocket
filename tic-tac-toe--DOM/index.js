const playerMove = (tile) => {
    let playerMarker = document.querySelector('.display-player');
    if (playerMarker.innerText === 'X') { // pass the next move to another player
        tile.classList.add('playerX');
        tile.innerText = 'X';
        playerMarker.innerText = 'O';
    } else {
        tile.classList.add('playerO');
        tile.innerText = 'O';
        playerMarker.innerText = 'X';
    }
    playerMarker.classList.toggle('playerX');
    playerMarker.classList.toggle('playerO');
}

const winCheck = (gameTiles) => {
    const doubler = 2;
    const rowCount = 3;
    const leftTopTileIndex = 0;
    const rightTopTileIndex = 2;
    const centerTileIndex = 4;
    const leftBotTileIndex = 6;
    const rightBotTileIndex = 8;
    let theWinner = '';
    for (let i = 0; i <= gameTiles.length - 1; i += rowCount) { // check if a player won filling a row
        if (gameTiles[i].innerText && gameTiles[i].innerText === gameTiles[i + 1].innerText && 
            gameTiles[i + 1].innerText === gameTiles[i + doubler].innerText) {
            theWinner = `Player ${gameTiles[i].innerText}`;
        }
    }
    for (let i = 0; i <= rowCount - 1; i++) { // check if a player won filling a column
        if (gameTiles[i].innerText && gameTiles[i].innerText === gameTiles[i + rowCount].innerText && 
            gameTiles[i + rowCount].innerText === gameTiles[i + doubler * rowCount].innerText) {
            theWinner = `Player ${gameTiles[i].innerText}`;
        }
    }
    if (gameTiles[centerTileIndex].innerText && 
        (gameTiles[leftTopTileIndex].innerText === gameTiles[centerTileIndex].innerText && 
        gameTiles[centerTileIndex].innerText === gameTiles[rightBotTileIndex].innerText) || 
        gameTiles[rightTopTileIndex].innerText === gameTiles[centerTileIndex].innerText && 
        gameTiles[centerTileIndex].innerText === gameTiles[leftBotTileIndex].innerText) { // check if a player won filling a diagonal
            theWinner = `Player ${gameTiles[centerTileIndex].innerText}`;
    }
    return theWinner;
}

const resetTiles = (gameTiles, tilesCount) => {
    for (let i = 0; i <= tilesCount - 1; i++) { // clean all the tiles and pass the next move to Player X
        gameTiles[i].innerText = '';
        gameTiles[i].className = 'tile';
        let playerMarker = document.querySelector('.display-player');
        playerMarker.innerText = 'X';
        if (playerMarker.classList.contains('playerO')) {
            playerMarker.classList.remove('playerO');
            playerMarker.classList.add('playerX');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {

    // main gameplay section

    const gameField = document.querySelector('.container');
    const gameTiles = [];
    const tilesCount = 9;
    let theWinnerGlobal = '';

    for (let i = 0; i <= tilesCount - 1; i++) {
        gameTiles[i] = gameField.appendChild(document.createElement('div')); // creating the tiles
        gameTiles[i].classList.add('tile');
    }

    let rounds = 1; // rounds counter and checkpoints
    const minRoundsForWin = 5;
    const maxGameRounds = 9;

    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
        resetTiles(gameTiles, tilesCount);
        rounds = 1;
        theWinnerGlobal = '';
    });

    gameField.addEventListener('click', function(event) {
        let targetTile = event.target.closest('.tile');
        if (targetTile.innerText === '') { // if target tile is empty, make a move
            playerMove(targetTile);
            rounds++;
            if (rounds > maxGameRounds) {
                theWinnerGlobal = winCheck(gameTiles);
                if (theWinnerGlobal) { // check if a player won the game
                    alert(`${theWinnerGlobal} won!`);
                } else {
                    alert(`Game over. It is a draw!`);
                }
                resetTiles(gameTiles, tilesCount);
                rounds = 1;
                theWinnerGlobal = '';
            } else if (rounds > minRoundsForWin) {
                theWinnerGlobal = winCheck(gameTiles);
                if (theWinnerGlobal) {
                    alert(`${theWinnerGlobal} won!`);
                    resetTiles(gameTiles, tilesCount);
                    rounds = 1;
                    theWinnerGlobal = '';
                }
            }
        }
    });

    // keyboard tilepicking

    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'Enter') {
            let currentTile;
            if (!document.querySelector('.tile.active')) { // if it is first keydown, select the left-top tile
                currentTile = gameTiles[0].classList.add('active');
            } else {
                currentTile = document.querySelector('.tile.active');
                let currentTileIndex = gameTiles.indexOf(currentTile);

                if (event.code === 'ArrowLeft') {
                    currentTile.classList.remove('active');
                    if (currentTileIndex - 1 >= 0) {
                        gameTiles[currentTileIndex - 1].classList.add('active');
                    } else {
                        gameTiles[gameTiles.length - 1].classList.add('active');
                    }
                } else if (event.code === 'ArrowRight') {
                    currentTile.classList.remove('active');
                    if (currentTileIndex + 1 <= gameTiles.length - 1) {
                        gameTiles[currentTileIndex + 1].classList.add('active');
                    } else {
                        gameTiles[0].classList.add('active');
                    }
                } else {
                    let targetTile = currentTile; // the same behavior as if tile clicked
                    if (targetTile.innerText === '') {
                        playerMove(targetTile);
                        rounds++;
                        if (rounds > maxGameRounds) {
                            theWinnerGlobal = winCheck(gameTiles);
                            if (theWinnerGlobal) {
                                alert `${theWinnerGlobal} won!`;
                                resetTiles(gameTiles, tilesCount);
                                rounds = 1;
                                theWinnerGlobal = '';
                            } else {
                                alert(`Game over. It is a draw!`);
                            }
                        } else if (rounds > minRoundsForWin) {
                            theWinnerGlobal = winCheck(gameTiles);
                            if (theWinnerGlobal) {
                                alert(`${theWinnerGlobal} won!`);
                                resetTiles(gameTiles, tilesCount);
                                rounds = 1;
                                theWinnerGlobal = '';
                            }
                        }
                    }
                }
            }
        }
    });

    // avatars picking section 

    const avatarField = document.querySelector('.avatar');
    let dragImage;

    avatarField.addEventListener('dragstart', function(event) {
        if (event.target.closest('.avatar-icon').parentElement.className === 'icons') { // image can be only picked from icons container
            dragImage = event.target.closest('.avatar-icon');
        }
    })

    avatarField.addEventListener('dragover', function(event) {
        event.preventDefault();
    })

    avatarField.addEventListener('drop', function(event) {
        event.preventDefault();
        const dragTarget = event.target.closest('.avatar-container');
        if (dragTarget && !dragTarget.classList.contains('container-full')) { // image can be moved only to an empty container
            dragImage.parentNode.removeChild(dragImage);
            event.target.appendChild(dragImage);
            dragTarget.classList.add('container-full');
            dragImage = null;
        }
    });
});