import {z} from 'zod'

const urlSchema = z.object({
    longURL: z.url("Please provide a valid URL"),
});

const shortURLSchema = z.object({
    shortURL: z.string("URL should be vaild").min(6).max(10),
});

export {urlSchema,shortURLSchema};