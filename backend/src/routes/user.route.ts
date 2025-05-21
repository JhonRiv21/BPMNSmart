import { Router, RequestHandler } from 'express';
import * as userController from '../controller/user.controller.ts';
import { verifyToken } from '../middlewares/auth/auth.middleware.ts';

const router = Router();

router.get(
  '/',
  verifyToken as RequestHandler,
  userController.getAllUsers as RequestHandler
);
router.post('/create', userController.createUser as RequestHandler);
router.post('/auth', userController.loginUser as RequestHandler);

export default router;
