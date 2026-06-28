import {prisma} from "../lib/prisma.js";
//to save the url in the database along with the short url
export const saveUrlMapping = async (longURL: string, shortURL: string) => {
    return prisma.uRL.create({
        data: {
            longURL,
            shortURL
        }
    });
};


//what if the url already exists in the database, it's not good to have duplicated entries
export const findURLInDB = async (longURL:string) => {
    return prisma.uRL.findFirst({
        where: {
            longURL
        }
    });
}


//to find the long url from the short url
export const findLongURL = async (shortURL: string) => {
    return prisma.uRL.findUnique({
        where: {
            shortURL
        }
    });
}