import express from 'express'
import dotenv from 'dotenv'
import urlRouter from './routes/url.router.js'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())


app.get('/api/health',(req,res) => {
    res.json({status: "ok"})
})

app.use('/api/url',urlRouter);


app.listen(PORT, ()=>{
    console.log("Server running");
})