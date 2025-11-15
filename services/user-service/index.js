import express from "express";
import { connectDb } from "./database/db.js";
import {userRouter} from './router/userRouter.js';
import {errorHandler} from "./middleware/errorhandler.js";
import {PORT} from './config/config.js';
import connection from "./rabbitmq/connection.js";
import {startConsumer} from './rabbitmq/startConsumer.js';

const server=express();





server.use(express.json());
server.use(errorHandler);
server.use("/api/v1/users",userRouter);

server.listen(PORT||3002, async()=>{
    console.log("================================");
    console.log(`USER SERVICE || PORT :${PORT}`);
    const channel=await connection.connect();
    console.log(`rabbitmq || connected`);
    await startConsumer();
    await connectDb();
    console.log("================================");

})
