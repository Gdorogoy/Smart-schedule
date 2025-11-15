import connection from "./connection.js";

class consumer{
    subscribe=async(routingKey , handler)=>{
        const channel= await connection.getChannel();
        const exchange= connection.exchange;
        const queue = `user-service_${routingKey}_queue`;

        channel.assertQueue(queue);
        channel.bindQueue(queue, exchange, routingKey);

        channel.consume(queue, 
            async(msg)=>{
                const content = JSON.parse(msg.content.toString());
                try{
                    await handler(content);
                    channel.ack(msg);
                }catch(err){
                    console.error(`ERROR IN HANDLING  ${routingKey} IN USER SERVICE`, err);
                    channel.nack(msg, false, true);
                }
        });
    }
}

export default new consumer;