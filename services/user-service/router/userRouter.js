import express from 'express';
import userController from '../controller/userController.js';
import taskContoller from '../controller/taskController.js';
import {validateTaskReq} from '../middleware/taskRequestValidaton.js'
import { verifyRequest } from '../middleware/authVerifyMiddleware.js';
export const userRouter=express.Router();

userRouter.get("/get",verifyRequest,userController.findUser);
userRouter.put("/update",verifyRequest,userController.updateUser);
userRouter.delete("/delete",verifyRequest,userController.deleteUser);
userRouter.post("/create",userController.createUser);



// userRouter.get("/:userId/:taskId",validateTaskReq,taskContoller.getAll);
userRouter.get("/task/getTasks",verifyRequest,taskContoller.getAll);
userRouter.post("/task/create",verifyRequest,validateTaskReq,taskContoller.createTask);
userRouter.put("/task/update/:taskId",verifyRequest,validateTaskReq,taskContoller.updateTask);
userRouter.delete("/task/delete/:taskId",verifyRequest,taskContoller.deleteTask);

