import taskController from "../controller/taskController.js";
import { Task } from "../model/task.js";


class taskEventHandler{
    handleAssign=async(message)=>{
        console.log('assiging')
        const{belongsTo,task,assignedBy}=message.payload;
        console.log(message.payload);
        console.log(task);

        const taskToSave=new Task({
            belongsTo:belongsTo,
            title:task.title,
            description:task.description,
            importance:task.importance,
            start:task.start,
            end:task.end,
            color:task.color,
            status:task.status,
            assignedBy,
            dueDate:task.dueDate,
            team:task.team
        });

        await taskToSave.save();

        return;
    }
    handleDelete=async(message)=>{
        const{userId,teamId}=message.payload;
        let taskToDelete=await Task.findOneAndDelete(
        {
            userId:userId,
            teamId:teamId
        });
        while(taskToDelete){
            taskToDelete=await Task.findOneAndDelete(
        {
            userId:userId,
            teamId:teamId
        });
        }

        

    }
}

export default new taskEventHandler;