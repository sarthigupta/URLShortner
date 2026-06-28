import express from 'express'
import dotenv from 'dotenv'
import urlRouter from './routes/url.router.js'
import "dotenv/config";
import cors from 'cors'
import { rateLimiter } from './middleware/rateLimit.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())
app.use(rateLimiter(100, 60)); // Apply global rate limiting to all routes


app.get('/api/health',(req,res) => {
    res.json({status: "ok"})
})

app.use('/api/url',urlRouter);


app.listen(PORT, ()=>{
    console.log("Server running");
})