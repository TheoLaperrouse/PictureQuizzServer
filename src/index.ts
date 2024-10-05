import suggestionRoutes from '@/features/suggestions/suggestions.controller';
import { setupSocket } from '@/services/socket.service';
import cors from 'cors';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
    }),
);

app.use(express.json());
app.use('/suggestions', suggestionRoutes);

setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
