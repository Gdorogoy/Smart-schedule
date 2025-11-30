import express from "express";
import taskController from "../controller/taskController.js";

export const taskRouter=express.Router();

taskRouter.get('/get/:userId',taskController.getTasks);
taskRouter.put('/update/:userId/:taskId',taskController.updateTask);
taskRouter.post('/create/:userId/',taskController.createTask);
taskRouter.delete('/delete/:userId/:taskId',taskController.deleteTask);


