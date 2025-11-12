import express from "express";
import { connectDb } from "./database/db.js";
import {userRouter} from './router/userRouter.js';
import {errorHandler} from "./middleware/errorhandler.js"
import {PORT} from './config/config.js'


const server=express();





server.use(express.json());
server.use(errorHandler);
server.use("/api/v1/users",userRouter);

server.listen(PORT||3002, async()=>{
    console.log("================================");
    console.log(`USER SERVICE || PORT :${PORT}`);
    await connectDb();
    console.log("================================");

})
