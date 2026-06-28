import { nanoid } from "nanoid";

export async function shortenUrl(longURL: string) {
    const shortId = nanoid(8);
    return shortId;
}


export const CACHE_TTL = 60 * 60 * 24;