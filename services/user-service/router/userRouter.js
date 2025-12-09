import express from 'express';
import userController from '../controller/userController.js';
import { verifyRequest } from '../middleware/authVerifyMiddleware.js';

export const userRouter=express.Router();

userRouter.get("/get/:userId",userController.findUser);
userRouter.put("/update",verifyRequest,userController.updateUser);
userRouter.delete("/delete",verifyRequest,userController.deleteUser);
userRouter.post("/create",userController.createUser);





