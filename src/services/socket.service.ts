import { Server } from 'socket.io';

export const setupSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {

        socket.on('message', (msg) => {
            io.emit('message', msg);
        });

        socket.on('disconnect', () => {
        });
    });

    return io;
};
