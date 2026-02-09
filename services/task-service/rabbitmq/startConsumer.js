import consumer from "./consumer.js"
import taskEventHandler from "../eventHandlers/taskEventHandler.js";
import connection from "./connection.js";



export const startConsumer=async()=>{
    // const channel = await connection.getChannel();

    // try {
    //     await channel.purgeQueue('task_queue_team.task.created');
    //     await channel.purgeQueue('task_queue_team.task.delete');
    //     console.log('Queues purged');
    // } catch(err) {
    //     console.log('Could not purge queues (might not exist yet):', err.message);
    // }

    await consumer.subscribe('team.task.created',
        taskEventHandler.handleAssign.bind(taskEventHandler)
    );

    await consumer.subscribe('team.task.delete',
        taskEventHandler.handleDelete.bind(taskEventHandler)
    );
    
    console.log(`CONSUMING TEAM-SERVICE FROM TASK SERVICE `);
}