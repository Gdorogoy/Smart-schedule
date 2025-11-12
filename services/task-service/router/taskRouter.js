import express from "express";
import taskController from "../controller/taskController.js";

export const taskRouter=express.Router();

taskRouter.get('/:userId/',taskController.getTasks);
taskRouter.put('/:userId/:taskId',taskController.updateTask);
taskRouter.post('/:userId/',taskController.createTask);
taskRouter.delete('/:userId/:taskId',taskController.deleteTask);


