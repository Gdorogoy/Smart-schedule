import express from 'express'
import teamController from '../controller/teamController';
import { verifyRequest } from '../middleware/authMiddleware';

const router=express.Router();

router.get('/get/:teamId',verifyRequest,teamController.getTeam);
router.get('/getAll',verifyRequest,teamController.getTeam);
router.post('/create',verifyRequest,teamController.createTeam);
router.put('/update/:teamId',verifyRequest,teamController.updateTeam);
router.put('/assisgn/:teamId',verifyRequest,teamController.assingTasksToTeam);
router.delete('/delete/:teamId',verifyRequest,teamController.deleteFromTeam);


