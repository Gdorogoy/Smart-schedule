import consumer from "./consumer.js"
import taskEventHandler from "../eventHandlers/taskEventHandler.js";

export const startConsumer=async()=>{
    await consumer.subscribe('team.task.created',
        taskEventHandler.handleAssign.bind(taskEventHandler)
    );

    await consumer.subscribe('team.task.delete',
        taskEventHandler.handleDelete.bind(taskEventHandler)
    );

    console.log(`CONSUMING TEAM-SERVICE FROM TASK SERVICE `);
}