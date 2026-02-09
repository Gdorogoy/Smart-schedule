import rabbitmq from './rabbitmq.js'


class producer{
    constructor(){
        this.queue='user_queue';
    }

    sendEvent=async(routingKey,payload)=>{
        const channel=await rabbitmq.getChannel();
        const exchange=rabbitmq.exchange;

        const message={
            routingKey:routingKey,
            payload:payload,
            timeStamp:new Date()
        }

        channel.publish(
            exchange,
            routingKey, 
            Buffer.from(JSON.stringify(message)),{
                persistent:true
        });

    }
}

export default new producer;