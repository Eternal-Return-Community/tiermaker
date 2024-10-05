const REGION = 'saopaulo';
const SEASON_ID = '14';
const TEAM_MODE = 'teamMode';

const leaderboard = async () => {
    const response = await fetch(`https://er.dakgg.io/api/v0/leaderboard?page=1${query()}`);
    return await response.json();
}

const query = () => new URLSearchParams({
    seasonKey: `SEASON_${SEASON_ID}`,
    serverName: REGION,
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


export default async () => {
    const data = await leaderboard();
    return data.leaderboards.map(({ userNum, nickname, rank, mostCharacters }) => ({
        nickname,
        elo: 'https://cdn.dak.gg'.concat(data.playerTierByUserNum[userNum].imageUrl),
        rank,
        character: characterById(mostCharacters, data.characterById)
    }))
}
