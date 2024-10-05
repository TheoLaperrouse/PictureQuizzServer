import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRandomPicture() {
    const randomPicture = await prisma.$queryRaw`SELECT * FROM "Picture" ORDER BY RANDOM() LIMIT 1`;
    return randomPicture[0];
}
