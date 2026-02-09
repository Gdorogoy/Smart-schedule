import connection from "./connection.js";

class consumer{
    subscribe=async(routingKey,handler)=>{
        const channel=await connection.getChannel();
        const exchange=connection.exchange;
        const queue=`task_queue_${routingKey}`;

        channel.assertQueue(queue);
        channel.bindQueue(queue, exchange, routingKey);

        channel.consume(queue,async(msg)=>{
            if(!msg) return;
            try{
                const content = JSON.parse(msg.content.toString());
                await handler(content);
                channel.ack(msg);
            }catch(err){
                console.log(err);
                console.error('Message content:', msg.content.toString());
                channel.nack(msg,false,false);
                
            }
        })
    }
}

export default new consumer;