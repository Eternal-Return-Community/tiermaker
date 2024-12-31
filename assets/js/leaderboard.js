const SEASON_ID = '15';
const TEAM_MODE = 'squad';

let players = {
    playerTierByUserNum: {},
    characterById: {},
    leaderboards: []
};

let count = 1;

const leaderboard = async (region) => {
    const response = await fetch(`https://er.dakgg.io/api/v0/leaderboard?page=${count}&${query(region)}`);
    return await response.json();
}

const query = (region) => new URLSearchParams({
    seasonKey: `SEASON_${SEASON_ID}`,
    serverName: region,
    teamMode: TEAM_MODE,
    hl: 'en'
}).toString()

const characterById = (mostCharacters, characterById) => {
    const character = mostCharacters[0].characterId;
    const { name, imageUrl } = characterById[character];
    return {
        name,
        imageUrl: 'https://cdn.dak.gg'.concat(imageUrl)
    }
}

export default async (region) => {
    
    while (true) {

        if(count > 2) break;

        const data = await leaderboard(region);
        if (data.leaderboards.length === 0) break;

        Object.assign(players.playerTierByUserNum, data.playerTierByUserNum);
        Object.assign(players.characterById, data.characterById);

        data.leaderboards
            .filter(i => i.mmr >= 3600) //3600 = Platinum IV;
            .forEach(player => players.leaderboards.push(player))

        count++
    }

    return players.leaderboards.map(({ userNum, nickname, rank, mostCharacters }) => ({
        nickname,
        elo: 'https://cdn.dak.gg'.concat(players.playerTierByUserNum[userNum].imageUrl),
        rank,
        character: characterById(mostCharacters, players.characterById)
    }))
}
