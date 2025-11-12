import amqplib from 'amqplib'


class connection{
    constructor(){
        this.connection=null;
        this.channel=null;
        this.exchange="team-exchange";
    }

    connect=async()=>{
        this.connection=await amqplib.connect('amqplib://localhost');
        this.channel=await this.connection.createChannel();

        await this.channel.assertExchange(this.exchange,"topic",{durable:true});

        console.log(`connected to channel ${this.channel} on team-service`);

        return this.channel;    
    }

    getChannel=async()=>{
        if(!this.channel){
            return this.connect;
        }
        return this.channel;
    }
}

export default new connection;