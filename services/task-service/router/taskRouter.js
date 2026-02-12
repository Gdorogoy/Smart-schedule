import express from "express";
import taskController from "../controller/taskController.js";
import {verifyRequest} from "../middleware/authMiddleware.js"
export const taskRouter=express.Router();

taskRouter.get('/get/:userId',verifyRequest,taskController.getTasks);
taskRouter.put('/update/:userId/:taskId',verifyRequest,taskController.updateTask);
taskRouter.post('/create/:userId',verifyRequest,taskController.createTask);
taskRouter.delete('/delete/:userId/:taskId',verifyRequest,taskController.deleteTask);
taskRouter.get('/get/team/:teamId',taskController.getTaskByTeam);
taskRouter.patch('/update/complete/:userId/:taskId',verifyRequest,taskController.completeTask)

