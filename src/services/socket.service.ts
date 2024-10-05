import { getRandomPicture } from '@/features/pictures/pictures.service';
import {
    createNewGame,
    addPlayerToGame,
    allPlayersAnsweredCorrectly,
    startNewRound,
    calculatePoints,
    getLeaderboard,
    getPictureRanks,
} from '@/utils/games.utils';
import { distance } from 'fastest-levenshtein';
import { Server } from 'socket.io';

const ACCEPTABLE_DIST = 2;

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST'],
        },
    });

    const games = {};

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', (data) => handleJoinRoom(socket, data, games, io));
        socket.on('submitAnswer', (data) => handleSubmitAnswer(socket, data, games, io));
        socket.on('disconnect', () => handleDisconnect(socket, games, io));
    });
};

const handleJoinRoom = async (socket, { roomId, username }, games, io) => {
    socket.join(roomId);
    const game = games[roomId] || (games[roomId] = createNewGame());

    addPlayerToGame(game, socket.id, username);
    console.log(`${username} joined room: ${roomId}`);

    io.to(roomId).emit('playerJoined', { players: game.players });
    const randomPicture = await getRandomPicture();
    game.correctAnswer = randomPicture.name;
    io.to(roomId).emit('newPicture', randomPicture.url);
};

const handleSubmitAnswer = (socket, { roomId, answer }, games, io) => {
    const game = games[roomId];
    if (!game) {
        return console.error(`Room ${roomId} does not exist.`);
    }

    const player = game.players[socket.id];
    if (distance(answer, game.correctAnswer) <= ACCEPTABLE_DIST) {
        const answerIndex = game.answers.length;
        const pointsEarned = calculatePoints(answerIndex);
        player.score += pointsEarned;

        if (!games[roomId].correctAnswers) {
            games[roomId].correctAnswers = [];
        }
        if (!games[roomId].correctAnswers.includes(socket.id)) {
            games[roomId].correctAnswers.push(socket.id);
        }

        console.log(`${player.username} answered correctly in room ${roomId}: ${answer}`);
        const pictureRanks = getPictureRanks(games[roomId]);
        io.to(roomId).emit('leaderboardUpdate', { players: game.players, pictureRanks });

        games[roomId].answers.push({ player: socket.id, answer });

        game.answers.push({ player: socket.id, answer });
        if (allPlayersAnsweredCorrectly(game)) {
            console.log(`All players answered correctly in room ${roomId}. Moving to a new image.`);
            games[roomId].answers = [];
            games[roomId].correctAnswers = [];
            startNewRound(roomId, games, io);
        }
    } else {
        console.log(`Incorrect answer in room ${roomId}: ${answer}`);
    }
};

const handleDisconnect = (socket, games, io) => {
    console.log('User disconnected:', socket.id);
    for (const roomId in games) {
        if (games[roomId].players[socket.id]) {
            delete games[roomId].players[socket.id];
            io.to(roomId).emit('leaderboardUpdate', getLeaderboard(games[roomId].players));
            console.log(`Player ${socket.id} left room ${roomId}`);
        }
    }
};
