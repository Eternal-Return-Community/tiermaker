import leaderboard from './leaderboard.js';

let isDragging = false;
let scrollInterval;

const characterPool = async () => {
    const leaderboards = await leaderboard()
    const pool = document.getElementById('character-pool');

    for (const { nickname, rank, elo, character } of leaderboards) {
        pool.innerHTML += `
        <div class='player-info' draggable="true" data-player=${nickname}>
            <span class='player-name'>${nickname}</span>
            <img draggable="false" class='player-elo' src='${elo}' alt='Elo'>
            <img draggable="false" class='player' src='${character.imageUrl}' alt='${character.name}'>
        </div>
        `;
    }
    disableLoading()
}

document.addEventListener("dragstart", event => {
    const target = event.target.closest('.player-info');
    if (target) {
        event.dataTransfer.setData("Player", target.dataset.player);
        target.style.opacity = '0.2';
        isDragging = true;
    }
});

document.addEventListener("dragend", event => {
    const target = event.target.closest('.player-info');
    if (target) {
        target.style.opacity = '1';
        isDragging = false;
        stopScrolling();
    }
});

document.addEventListener("dragover", event => {
    event.preventDefault();
    if (isDragging) {
        const scrollThreshold = 50;
        const scrollSpeed = 5;

        const { clientY } = event;
        const { innerHeight } = window;

        if (clientY < scrollThreshold) {
            startScrolling(-scrollSpeed);
        } else if (clientY > innerHeight - scrollThreshold) {
            startScrolling(scrollSpeed);
        } else {
            stopScrolling();
        }
    }
});

document.addEventListener("drop", event => {
    event.preventDefault();
    isDragging = false;
    stopScrolling();

    const data = event.dataTransfer.getData("Player");
    const playerElement = document.querySelector(`[data-player='${data}']`);
    const targetTier = event.target.closest('.tier');
    if (targetTier && playerElement) {
        targetTier.appendChild(playerElement);
    }
});

function startScrolling(speed) {
    if (!scrollInterval) {
        scrollInterval = setInterval(() => {
            window.scrollBy(0, speed);
        }, 16); 
    }
}

function stopScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

const disableLoading = () => {
    document.querySelector('body').removeAttribute('id')
    document.querySelector('main').removeAttribute('style')
}

const init = async () => await characterPool();

document.addEventListener('DOMContentLoaded', init);