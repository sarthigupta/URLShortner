import {prisma} from "../lib/prisma.js";
export const saveUrlMapping = async (longURL: string, shortURL: string) => {
    return prisma.uRL.create({
        data: {
            longURL,
            shortURL
        }
    });
};

export const findLongURL = async (shortURL: string) => {
    return prisma.uRL.findUnique({
        where: {
            shortURL
        }
    });
}