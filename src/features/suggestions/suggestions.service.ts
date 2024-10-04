import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveSuggestion = async (name: string, url: string) => {
    const newSuggestion = await prisma.suggestion.create({
        data: { name, url },
    });
    return newSuggestion;
};

export const getAllSuggestions = async () => {
    return await prisma.suggestion.findMany();
};
