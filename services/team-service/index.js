import express from 'express'
import {connectDb} from './database/db.js'
import {PORT} from './config/config.js'
import connection from './rabbitmq/rabbitmq.js'
const server=express();

server.use(express.json());

server.route('/api/v1/team',);

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