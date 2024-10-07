const SEASON_ID = '14';
const TEAM_MODE = 'teamMode';

const leaderboard = async (region) => {
    const response = await fetch(`https://er.dakgg.io/api/v0/leaderboard?page=1${query(region)}`);
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
    const data = await leaderboard(region);
    return data.leaderboards.map(({ userNum, nickname, rank, mostCharacters }) => ({
        nickname,
        elo: 'https://cdn.dak.gg'.concat(data.playerTierByUserNum[userNum].imageUrl),
        rank,
        character: characterById(mostCharacters, data.characterById)
    }))
}
