import type { Request, Response } from "express";
import { shortenUrl } from "../helper/url.helper.js";
import { saveUrlMapping } from "../repository/url.repo.js";
import { findLongURL } from "../repository/url.repo.js";
import { urlSchema ,shortURLSchema} from "../zod/zod.js";

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
    const shortURL = await shortenUrl(longURL);
    
    const urlMapping = await saveUrlMapping(longURL, shortURL);

    
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
        const url = await findLongURL(shortURL);

        if (!url) {
            return res.status(404).json({
                error: "URL not found",
                success: false
            });
        }

        return res.redirect(url.longURL);


    } catch (error){
        console.log("error in redirectURL",error);
    }
};
