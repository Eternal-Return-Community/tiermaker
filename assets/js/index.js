import leaderboard from './leaderboard.js';

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
        event.dataTransfer.setData("Player", target.dataset.player);
        target.style.opacity = '0.2';
    }
});

document.addEventListener("dragend", event => {
    const target = event.target.closest('.player-info');
    if (target) {
        target.style.opacity = '1';
    }
});

document.addEventListener("dragover", event => {
    event.preventDefault();
});

document.addEventListener("drop", event => {
    event.preventDefault();

    const data = event.dataTransfer.getData("Player");
    const playerElement = document.querySelector(`[data-player='${data}']`);
    event.target.closest('.tier').appendChild(playerElement); 
});

const disableLoading = () => {
    document.querySelector('body').removeAttribute('id')
    document.querySelector('main').removeAttribute('style')
}

const init = async () => await characterPool();

document.addEventListener('DOMContentLoaded', init);