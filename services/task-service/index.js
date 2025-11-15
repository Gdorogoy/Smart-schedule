import express from 'express'
import { connectDb } from './database/db.js';
import { taskRouter } from './router/taskRouter.js';
import { PORT } from './config/config.js';
import connection from './rabbitmq/connection.js';
import {startConsumer} from './rabbitmq/startConsumer.js';


const server=express();
server.use(express.json());



server.use("/api/v1/tasks",taskRouter);

server.listen(PORT ||3004,async()=>{
    console.log("================================");
    console.log(`TASK SERVICE || PORT :${PORT}`);
    const channel=await connection.connect();
    console.log(`rabbitmq || connected`);
    await startConsumer();
    await connectDb();
    console.log("================================");
});