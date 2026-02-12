import express from 'express'
import teamController from '../controller/teamController.js';
import { verifyRequest } from '../middleware/authMiddleware.js';

export const router=express.Router();

router.get('/get/:teamId',verifyRequest,teamController.getTeam);
router.get('/getAll',verifyRequest,teamController.getAllTeams);
router.post('/create',verifyRequest,teamController.createTeam);
router.put('/update/:teamId',verifyRequest,teamController.updateTeam);
router.put('/assign/:teamId',verifyRequest,teamController.assignTasksToTeam);
router.delete('/delete/:teamId',verifyRequest,teamController.deleteFromTeam);
router.put('/add/:taskId',verifyRequest,teamController.addToTask);
//todo router.delete('/delete/teams/:teamId',verifyRequest,teamController.deleteFromTeam);



