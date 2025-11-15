import ampqlib from 'amqplib'
class connection{
    constructor(){
        this.connection=null;
        this.channel=null;
        this.exchange="team-exchange";

    }

    connect=async()=>{
        this.connection=await ampqlib.connect('amqp://localhost');
        this.channel=this.connection.createChannel();

         (await this.channel).assertExchange(this.exchange, "topic",{durable:true});

         console.log(`connected to channel ${this.channel} in user-service`);
        return this.channel;
    }

    getChannel=async()=>{
        if(!this.channel){
            return await this.connect();
        }return this.channel;
    }
}

export default new connection;