import express, { Application, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { authMiddleware } from './authMiddleware';
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from '@repo/common/types'
import {prismaClient} from '@repo/db/clients';
import bcrypt from 'bcrypt'

const app: Application = express();
app.use(express.json())


app.post('/signup',async(req: Request, res: Response)=> {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
         res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password,10);


    try {
        const user = await prismaClient.user.create({
            data:{
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch (error) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post('/signin',async(req,res)=>{
    
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
           message: "Incorrect inputs"
       })
       return;
   }    

   const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data.username
        }
   })
   console.log(user);

   if(!user){
    res.json({
        message: "Not authorized"
    })
    return
   }

   const convertedPassword = await bcrypt.compare(parsedData.data.password,user.password)

   if(convertedPassword){
    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET)
    res.json({
        token: token
    })
   }
   else{
    res.status(403).json({
        message: "Incorrect credentials"
    })
   }
})

app.post('/create-room',authMiddleware, async(req,res)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
           message: "Incorrect inputs"
       })
       return;
   }    

   const userId = req.userId;
   
   if (!userId) {
    res.status(400).json({
        message: "User ID is required"
    });
    return;
}
   const room = await prismaClient.room.create({
    data:{
        slug:parsedData.data.name,
        adminId: userId  
    }
   })

    res.json({
        roomId: room.id
    })
})

app.get('/chats/:roomId',async(req,res)=>{
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy:{
            id: "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
});

app.listen(3001,()=>{
    console.log("Listening to port 3001")
});