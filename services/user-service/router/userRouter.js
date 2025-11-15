import express from 'express';
import userController from '../controller/userController.js';
import taskContoller from '../controller/taskController.js';
import {validateTaskReq} from '../middleware/taskRequestValidaton.js'
import { verifyRequest } from '../middleware/authVerifyMiddleware.js';
export const userRouter=express.Router();

userRouter.get("/",verifyRequest,userController.findUser);
userRouter.put("/",verifyRequest,userController.updateUser);
userRouter.delete("/",verifyRequest,userController.deleteUser);
userRouter.post("/",userController.createUser);



// userRouter.get("/:userId/:taskId",validateTaskReq,taskContoller.getAll);
userRouter.get("/:userId/task",verifyRequest,taskContoller.getAll);
userRouter.post("/:userId/task",verifyRequest,validateTaskReq,taskContoller.createTask);
userRouter.put("/:userId/task/:taskId",verifyRequest,validateTaskReq,taskContoller.updateTask);
userRouter.delete("/:userId/task/:taskId",verifyRequest,taskContoller.deleteTask);