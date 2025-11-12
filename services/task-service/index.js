import express from 'express'
import { connectDb } from './database/db.js';
import rabbitmq from './rabbitmq/rabbitmq.js';
import { taskRouter } from './router/taskRouter.js';
import { PORT } from '/config/config.js';



const server=express();
server.use(express.json());



server.use("/api/v1/tasks",taskRouter);

server.listen(PORT ||3004,async()=>{
    console.log("================================");
    console.log(`TASK SERVICE || PORT :${PORT}`);
    await connectDb();
    console.log("================================");
});