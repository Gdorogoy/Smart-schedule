import express from 'express';
import { connectDb } from './database/db.js';
import {authRouter} from './router/authRouter.js'
import { PORT } from './config/config.js';



const server=express();

server.use(express.json());

server.use("/auth",authRouter);

server.listen(PORT|| 3001, async()=>{
    console.log("================================");
    console.log(`AUTH SERVICE || PORT :${PORT}`);
    await connectDb();
    console.log("================================");

});