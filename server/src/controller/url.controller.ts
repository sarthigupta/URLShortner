import type { Request, Response } from "express";
import { shortenUrl } from "../helper/url.helper.js";
import { findURLInDB, saveUrlMapping } from "../repository/url.repo.js";
import { findLongURL } from "../repository/url.repo.js";
import { urlSchema ,shortURLSchema} from "../zod/zod.js";
import { redis } from "../lib/redis.js";
import { CACHE_TTL } from "../helper/url.helper.js";

export const shortenURL = async (req: Request, res: Response) => {
  try {
    const parsed = urlSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message,
        success: false,
      });
    }
    const longURL = parsed.data.longURL;

    //first we check cache, if it's there or not
    const cachedShortURL = await redis.get(`long:${longURL}`);
    if (cachedShortURL) {
      
      console.log("cache hit for longURL");

      return res.status(200).json({
        shortURL: cachedShortURL,
        longURL,
        success: true,
      });
    }


    //if not then
    //what if the url is already there in the database, we should return the existing short url instead of creating a new one, and also cache it
    const existingURL = await findURLInDB(longURL);

    if(existingURL){
      await redis.set(`long:${longURL}`, existingURL.shortURL,{ex: CACHE_TTL}); // cache for 24 hours
      await redis.set(`short:${existingURL.shortURL}`, longURL,{ex: CACHE_TTL}); // cache for 24 hours
      return res.status(200).json({
        shortURL: existingURL.shortURL,
        longURL,
        success: true,
      });
    }

    //if it's not there in the database, then we create a new short url and save it in the database and also cache it

    const shortURL = await shortenUrl(longURL);
    
    await saveUrlMapping(longURL, shortURL);

    await redis.set(`long:${longURL}`, shortURL,{ex: CACHE_TTL});
    await redis.set(`short:${shortURL}`, longURL,{ex: CACHE_TTL}) // cache for 24 hours

    return res.status(201).json({
      shortURL: shortURL,
      longURL: longURL,
      success: true,
    });

    
  } catch (error) {
    console.log("error in shorten url", error);
    return res.status(500).json({
        error: "Internal Server Error",
        success: false
    });
  }
};

export const redirectURL = async (req: Request, res: Response) => {
    try {
        const parsed = shortURLSchema.safeParse(req.params);
        if(!parsed.success){
            return res.status(400).json({
                error: parsed.error.issues[0]?.message,
                success: false,
            })
        }
        const shortURL = parsed.data.shortURL;

        //check the cache first, if it's there then redirect to the long url

        const cachedLongURL = await redis.get(`short:${shortURL}`);
        if(cachedLongURL){
            console.log("cache hit for shortURL");
            return res.redirect(cachedLongURL.toString());
        }
        
        //if not then in database
        const url = await findLongURL(shortURL);

        if (!url) {
            return res.status(404).json({
                error: "URL not found",
                success: false
            });
        }

        await redis.set(`short:${shortURL}`, url.longURL,{ex: CACHE_TTL}); // cache for 24 hours
        await redis.set(`long:${url.longURL}`, shortURL, { ex: CACHE_TTL });

        return res.redirect(url.longURL);


    } catch (error){
        console.log("error in redirectURL",error);
        return res.status(500).json({
            error: "Internal Server Error",
            success: false
        });
    }
};
