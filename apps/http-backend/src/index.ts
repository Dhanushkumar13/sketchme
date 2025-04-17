import express, { Application, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { authMiddleware } from './authMiddleware';
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from '@repo/common/types'


const app: Application = express();
app.use(express.json())


app.post('/signup',(req: Request, res: Response)=> {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
         res.json({
            message: "Incorrect inputs"
        })
        return;
    }    
})

app.post('/signin',async(req,res)=>{
    
    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        res.json({
           message: "Incorrect inputs"
       })
       return;
   }    

    const userId = 1;
    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        token
    })
})

app.post('/create-room',authMiddleware, async(req,res)=>{
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
           message: "Incorrect inputs"
       })
       return;
   }    
    res.json({
        roomId: 123
    })
})

app.listen(3001,()=>{
    console.log("Listening to port 3001")
});