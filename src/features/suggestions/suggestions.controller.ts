import { saveSuggestion, getAllSuggestions } from './suggestions.service.js';
import { validate } from '@/middlewares/validateRequest';
import { SuggestionModel } from '@/schemas';
import express, { Request, Response } from 'express';

const router = express.Router();

const SuggestionPost = SuggestionModel.omit({ id: true });

router.post('/', validate(SuggestionPost), async (req: Request, res: Response) => {
    const { name, url } = req.body;
    const suggestion = await saveSuggestion(name, url);
    res.status(201).json(suggestion);
});

router.get('/', async (req: Request, res: Response) => {
    const suggestions = await getAllSuggestions();
    res.status(200).json(suggestions);
});

export default router;
