import { changeGameState, gameState, resetGame, updateLivesDisplay, lazers, player, startButton, restartButton, pauseButton, playingMenu, gameOverMenu, startMenuElement } from "./script.js";
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
        lazers.push(new Lazer(player.x + player.width / 2, player.y));
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
        changeGameState(STATES.START_MENU);
        startMenuElement.style.display = "flex";
    } else if(gameState === STATES.START_MENU) {
        changeGameState(STATES.PLAYING);
        startMenuElement.style.display = "none";
    }
});
