import leaderboard from './leaderboard.js';

let isDragging = false;
let scrollInterval;

const characterPool = async () => {
    const leaderboards = await leaderboard()
    const pool = document.getElementById('character-pool');

    for (const { nickname, elo, character } of leaderboards) {
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
        target.style.opacity = '0.2';
        event.dataTransfer.setData("Player", target.dataset.player);
        isDragging = true;
    }
});

document.addEventListener("dragend", event => {
    const target = event.target.closest('.player-info');
    if (target) {
        target.style.cursor = 'grab';
        target.style.opacity = '1';
        isDragging = false;
        stopScrolling();
    }
    btn()
});

const btn = () => {
    const x = document.getElementById('download');
    x.disabled = false
    x.style.background = '#79afb9'
    x.style.color = 'white'
    x.style.cursor= 'pointer';
} 

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
    const target = event.target.closest('.tier');
    if (target && playerElement) {
        target.appendChild(playerElement);
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

document.getElementById('download').addEventListener('click', () =>
    domtoimage.toPng(document.getElementById('tier-container')).then(url => download(url)));

const download = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'imagem.jpg';
    link.click();
};

const init = async () => await characterPool();

document.addEventListener('DOMContentLoaded', init);