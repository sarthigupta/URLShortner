import express from 'express'
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())


app.get('/api/health',(req,res) => {
    res.json({status: "ok"})
})

app.post('/api/shorten', async (req,res) => {
    const { longURL } = req.body;

});


app.listen(PORT, ()=>{
    console.log("Server running");
})