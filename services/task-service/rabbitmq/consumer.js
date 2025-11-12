import connection from "./connection.js";

class consumer{
    subscribe=async(routingKey,handler)=>{
        const channel=await connection.getChannel();
        const exchange=connection.exchange;
        const queue=`task_queue_${routingKey}`;

        channel.assertQueue(queue);
        channel.bindQueue(queue, exchange, routingKey);

        channel.consume(queue,async(msg)=>{
            const content=JSON.stringify(msg);
            try{
                await handler(content);
                channel.ack(msg);
            }catch{
                channel.nack(msg);
                
            }
        })
    }
}

export default new consumer;