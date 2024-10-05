import { getRandomPicture } from '@/features/pictures/pictures.service';

/**
 * Creates a new game object.
 * @returns {Object} An object representing the game with players, answers, and a correct answer.
 */
export const createNewGame = () => ({
    players: {},
    answers: [],
    correctAnswers: [],
    correctAnswer: '',
});

/**
 * Adds a player to the game object.
 * @param {Object} game - The game object to which the player will be added.
 * @param {string} playerId - The ID of the player to add.
 * @param {string} username - The username of the player.
 */
export const addPlayerToGame = (game, playerId, username) => {
    game.players[playerId] = {
        username,
        score: 0,
        avatar: `https://robohash.org/${username}.png`,
    };
};

/**
 * Checks if all players have answered correctly.
 * @param {Object} game - The game object containing players and their answers.
 * @returns {boolean} - Returns true if all players answered correctly, otherwise false.
 */
export const allPlayersAnsweredCorrectly = (game) =>
    Object.keys(game.players).every((playerId) => game.answers.some((answer) => answer.player === playerId));

/**
 * Starts a new round of the game.
 * @param {string} roomId - The ID of the game room.
 * @param {Object} games - The object containing all ongoing games.
 * @param {Object} io - The Socket.io instance for emitting events.
 */
export const startNewRound = async (roomId, games, io) => {
    const randomPicture = await getRandomPicture();
    games[roomId].correctAnswer = randomPicture.name;
    games[roomId].answers = [];
    io.to(roomId).emit('newPicture', randomPicture.url);
};

/**
 * Calculates the number of points to award to a player based on the number of answers.
 * @param {string} roomId - The ID of the game room.
 * @param {Object} games - The object containing all ongoing games.
 * @returns {number} - The number of points to award.
 */
export const calculatePoints = (answerIndex) => {
    const bonusPoints = [3, 2, 1];
    const basePoints = 5;

    return basePoints + (bonusPoints[answerIndex] || 0);
};

/**
 * Gets the leaderboard of players based on their scores.
 * @param {Object} players - An object containing players and their scores.
 * @returns {Array} - An array of players sorted by descending score.
 */
export const getLeaderboard = (players) => Object.values(players).sort((a, b) => b.score - a.score);

export const getPictureRanks = ({ players, correctAnswers }) => {
    return correctAnswers.map((playerId) => players[playerId].username);
};
