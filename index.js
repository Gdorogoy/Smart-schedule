import express from "express";
import { PORT , URL} from "./shared/config/config.js";
import { userRouter } from "./services/user-service/controller/userRouter.js";
import { connectDb } from "./models/db.js";
import { authRouter } from "./services/auth-service/router/authRouter.js";
import cors from 'cors'

/*
    1.learn rabbitmq
    2.create orrganiztation :{
        name,
        teams,
        employees,
        username,
        passowrd,
    }
    3.create crud operrations until rabbitmq needed then add rabbitmq
    4.teams:{
        name,
        employees,
        authEmployees
    }
    5 update employee so he would have:{
        role,
        job title,
        orrganiztation
    }
*/


const server=express();


server.use(express.json());

server.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


server.use(`${URL}/auth`,authRouter);
server.use(`${URL}/user`,userRouter);



server.listen(PORT,async()=>{
    await connectDb();
    console.log('server running');
});