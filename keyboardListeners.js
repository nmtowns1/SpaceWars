import { backToMenuButton, changeGameState, gameState, resetGame, updateLivesDisplay, lazers, player, startButton, restartButton, pauseButton, playingMenu, gameOverMenu, startMenuElement, pauseMenu, resumeButton, restartButtonPause } from "./script.js";
import { keys, Lazer } from "./entities.js";
import { STATES } from "./constraints.js";

window.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft" || e.key === "a") {
        keys.left = true;
    }
    if(e.key === "ArrowRight" || e.key === "d") {
        keys.right = true;
    }
    if(e.code === "Space") {
        e.preventDefault(); // Prevent the default action of the spacebar (scrolling)
        
        if(!e.repeat) { // Check if the key is not being held down
            lazers.push(new Lazer(player.x + player.width / 2, player.y));
        }
    }
});

window.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft" || e.key === "a") {
        keys.left = false;
    }
    if(e.key === "ArrowRight" || e.key === "d") {
        keys.right = false;
    }
});

startButton.addEventListener("click", () => {
    changeGameState(STATES.PLAYING);
    playingMenu.style.display = "flex";
});

restartButton.addEventListener("click", () => {
    resetGame();
    playingMenu.style.display = "flex";
    
    gameOverMenu.style.display = "none";
    updateLivesDisplay();
});

pauseButton.addEventListener("click", () => {
    if(gameState === STATES.PLAYING) {
        changeGameState(STATES.PAUSED);
        pauseMenu.style.display = "flex";
    } else if(gameState === STATES.PAUSED) {
        changeGameState(STATES.PLAYING);
        pauseMenu.style.display = "none";
    }
    pauseButton.blur();
});

resumeButton.addEventListener("click", () => {
    changeGameState(STATES.PLAYING);
    pauseMenu.style.display = "none";
    playingMenu.style.display = "flex";
});

restartButtonPause.addEventListener("click", () => {
    resetGame();
    changeGameState(STATES.PLAYING);
    pauseMenu.style.display = "none";
    playingMenu.style.display = "flex";
});

backToMenuButton.addEventListener("click", () => {
    changeGameState(STATES.START_MENU);
    startMenuElement.style.display = "flex";
    playingMenu.style.display = "none";
    gameOverMenu.style.display = "none";
    pauseMenu.style.display = "none";
});
