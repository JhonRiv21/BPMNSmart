import { Router, RequestHandler } from "express";
import * as userController from '../controller/user.controller.ts';

const router = Router();
  
router.get('/', userController.getAllUsers as RequestHandler);
router.post('/create', userController.createUser as RequestHandler);

export default router;