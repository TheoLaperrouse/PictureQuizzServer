import { getRandomPicture } from '@/features/pictures/pictures.service';
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
    let correctAnswer = '';
    const games = {};

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', async ({ roomId, username }) => {
            socket.join(roomId);

            if (!games[roomId]) {
                games[roomId] = {
                    players: {},
                    answers: [],
                };
            }

            games[roomId].players[socket.id] = {
                username,
                score: 0,
                avatar: `https://robohash.org/${username}.png`,
            };

            console.log(`${username} joined room: ${roomId}`);

            io.to(roomId).emit('playerJoined', {
                players: games[roomId].players,
            });
            const randomPicture = await getRandomPicture();
            correctAnswer = randomPicture.name;
            io.to(roomId).emit('newPicture', randomPicture.url);
        });

        socket.on('submitAnswer', ({ roomId, answer }) => {
            if (!games[roomId]) {
                console.error(`Room ${roomId} does not exist.`);
                return;
            }
            const player = games[roomId].players[socket.id];

            if (distance(answer, correctAnswer) <= ACCEPTABLE_DIST) {
                console.log(`${player.username} gave the correct answer in room ${roomId}: ${answer}`);

                const pointsEarned = calculatePoints(roomId);
                player.score += pointsEarned;

                io.to(roomId).emit('leaderboardUpdate', getLeaderboard(games[roomId].players));
            } else {
                console.log(`Incorrect answer in room ${roomId}: ${answer}`);
            }

            games[roomId].answers.push({ player: socket.id, answer });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            for (const roomId in games) {
                if (games[roomId].players[socket.id]) {
                    delete games[roomId].players[socket.id];
                    console.log(games[roomId].players);
                    io.to(roomId).emit('leaderboardUpdate', getLeaderboard(games[roomId].players));
                    console.log(`Player ${socket.id} left room ${roomId}`);
                }
            }
        });
    });

    const calculatePoints = (roomId) => {
        const numAnswers = games[roomId].answers.length;
        const maxPoints = 8;
        const points = Math.max(maxPoints - numAnswers, 1);
        return points;
    };

    const getLeaderboard = (players) => {
        return Object.values(players).sort((a, b) => b.score - a.score);
    };
};
