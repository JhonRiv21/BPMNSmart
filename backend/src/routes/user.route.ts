import { Router, RequestHandler } from 'express';
import * as userController from '../controller/user.controller.ts';
import { verifyToken } from '../middlewares/auth/auth.middleware.ts';

const router = Router();

router.get(
  '/',
  verifyToken as RequestHandler,
  userController.getAllUsers as RequestHandler
);

export default router;
