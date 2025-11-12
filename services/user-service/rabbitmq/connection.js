import ampqlib from 'amqplib'
class connection{
    constructor(){
        this.connection=null;
        this.channel=null;
        this.exchange="team-exchange";

    }

    connect=async()=>{
        this.connection=await ampqlib.connect('ampq://localhost');
        this.channel=this.connection.createChannel();

        await this.channel.assertExchange(exchange, "topic",{durable:true});

        return this.channel;
    }

    getChannel=async()=>{
        if(!this.channel){
            return await this.connect();
        }return this.channel;
    }
}

export default new connection;