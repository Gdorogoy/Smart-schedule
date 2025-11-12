import express from 'express'
import teamController from '../controller/teamController';
import { verifyRequest } from '../middleware/authMiddleware';

const router=express.Router();

router.get('/',verifyRequest,teamController.getTeam);
router.post('/',verifyRequest,teamController.createTeam);
router.put('/update',verifyRequest,teamController.updateTeam);
router.put('/assisgn',verifyRequest,teamController.assingTasksToTeam);
router.delete('/',verifyRequest,teamController.deleteFromTeam);


