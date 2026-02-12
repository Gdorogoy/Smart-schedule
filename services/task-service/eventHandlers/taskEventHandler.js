import taskController from "../controller/taskController.js";
import { Task } from "../model/task.js";


class taskEventHandler{
    handleAssign=async(message)=>{
        try{
            const{belongsTo,task,assignedBy}=message.payload;
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
        }catch(err){
            console.error(err);
            throw(err);
        }
    }
    handleDelete=async(message)=>{
        try{
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
        }catch(err){
            console.error(err);
            throw(err);
        }
    }

    handleAdd = async (message) => {
        try {
            const { taskId, membersList } = message.payload;
            
            const memberIds = membersList.map(m => m.id);

            const result = await Task.findByIdAndUpdate(
            taskId,
            { $addToSet: { belongsTo: { $each: memberIds } } },
            { new: true }
            );
        } catch (err) {
            console.error(err);
            throw err;
        }
        };
}

export default new taskEventHandler;