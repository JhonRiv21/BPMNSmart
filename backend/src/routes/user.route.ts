import { Router } from "express";
import * as userController from '../controller/user.controller.ts'

const router = Router();
  
router.get('/', userController.getAllUsers);

export default router;