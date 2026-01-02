import express from 'express'
import {connectDb} from './database/db.js'
import {PORT} from './config/config.js'
import connection from './rabbitmq/rabbitmq.js'
import {router} from './router/teamRoueter.js'

const server=express();


server.use(express.json());

server.use("/teams",router);

server.listen(PORT || 3003, async () => {
    console.log("================================");
    console.log(`TEAM SERVICE || PORT: ${PORT}`);

    try {
        await connection.getChannel(); 
    } catch (err) {
        console.error("RABBITMQ FAILED:", err);
        process.exit(1);
    }

    await connectDb();
    console.log("================================");
});