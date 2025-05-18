import { Router } from "express";
import * as userController from '../controller/user.controller'

const router = Router();
  
router.get('/users', userController.getAllUsers);

export default router;