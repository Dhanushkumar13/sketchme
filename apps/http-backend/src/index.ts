import express, { Application, Request, Response } from 'express';
import z from 'zod';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { authMiddleware } from './authMiddleware';

const app: Application = express();
app.use(express.json())

const signupParse = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
})

app.post('/signup',(req: Request, res: Response)=> {
    const parseSuccess = signupParse.safeParse(req.body);

    if(!parseSuccess.success){
        res.json({
            message: "Invalid input",
            errors: parseSuccess.error.errors,
        })
    }
})

app.post('/signin',async(req,res)=>{
    

    const userId = 1;
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        token
    })
})

app.post('/create-room',authMiddleware, async(req,res)=>{
    res.json({
        roomId: 123
    })
})

app.listen(3001,()=>{
    console.log("Listening to port 3001")
});