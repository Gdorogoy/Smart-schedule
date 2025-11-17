import amqplib from 'amqplib'
import {RABBITMQ_URL} from '../config/config.js'

class connection{
    constructor(){
        this.connection=null;
        this.channel=null;
        this.exchange="team-exchange";
    }
    connect = async (retries = 10, delay = 3000) => {
        for (let i = 0; i < retries; i++) {
            try {
                this.connection = await amqplib.connect(RABBITMQ_URL);
                this.channel = await this.connection.createChannel();
                await this.channel.assertExchange(this.exchange, "topic", { durable: true });
                console.log(`Connected to RabbitMQ`);
                return this.channel;
            } catch (err) {
                console.error(`retrying to connect in ${delay}`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
        throw new Error("failed to connect to rabbitmq");
    }

    getChannel=async()=>{
        if(!this.channel){
            return await this.connect();
        }
        return this.channel;
    }
}

export default new connection;