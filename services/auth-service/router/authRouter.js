import express from 'express'
import jwtService from '../controller/jwtService.js'
import { validateReq, validateReqLog } from '../middleware/validateRequest.js';

export const authRouter=express.Router();


authRouter.post("/signup",jwtService.createUser);
authRouter.put("/logout/:userId",validateReq,jwtService.invalidateToken);
authRouter.post("/login",validateReqLog,jwtService.login);
authRouter.post("/refresh",jwtService.refreshToken);
authRouter.delete("/delete",jwtService.deleteUser);
authRouter.put("/invalidate",jwtService.invalidateToken);

