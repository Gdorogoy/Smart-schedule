import userEventHandlers from "../eventHandlers/userEventHandlers.js";
import consumer from "./consumer.js"

export const startConsumer=async()=>{
    await consumer.subscribe('team.user.update',
        userEventHandlers.addUserToTeam.bind(userEventHandlers)
    );
    await consumer.subscribe('team.user.delete',
        userEventHandlers.deleteUserFromTeam.bind(userEventHandlers)
    );
    
    console.log(`CONSUMING TEAM-SERVICE FROM USER SERVICE`);
}