const TEAM_MODE = 'squad';

const players = {
    playerTierByUserNum: {},
    characterById: {},
    leaderboards: []
};

let count = 1;

const season = async () => {
    const response = await fetch('https://er.dakgg.io/api/v0/current-season')
    const data = await response.json();
    return data.type;
}

const leaderboard = async (region) => {
    const q = await query(region);
    const response = await fetch(`https://er.dakgg.io/api/v0/leaderboard?page=${count}&${q}`);
    return await response.json();
}

const query = async (region, teamMode = TEAM_MODE) => new URLSearchParams({
    seasonKey: await season(),
    serverName: region,
    teamMode,
    hl: 'en'
}).toString()

const characterById = (mostCharacters) => {
    const id = mostCharacters[0].characterId;
    const { name, imageUrl } = players.characterById[id];
    return {
        name,
        imageUrl: 'https://cdn.dak.gg'.concat(imageUrl)
    }
}

export default async (region) => {

    while (true) {

        if (count > 2) break;

        const data = await leaderboard(region);
        if (data.leaderboards.length === 0) break;

        Object.assign(players.playerTierByUserNum, data.playerTierByUserNum);
        Object.assign(players.characterById, data.characterById);

        data.leaderboards
            .filter(i => i.mmr >= 3600) //3600 = Platinum IV;
            .forEach(({ userNum, nickname, rank, mostCharacters }) => players.leaderboards.push({
                nickname,
                elo: 'https://cdn.dak.gg'.concat(players.playerTierByUserNum[userNum].imageUrl),
                rank,
                character: characterById(mostCharacters)
            }))

        count++
    }

    return players.leaderboards;
}
