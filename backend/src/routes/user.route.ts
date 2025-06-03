import { Router, RequestHandler } from 'express';
import * as userController from '../controller/user.controller.ts';
import {
  refreshTokenIfNeeded,
  verifyToken,
} from '../middlewares/auth/auth.middleware.ts';

const router = Router();

router.get(
  '/',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  userController.getAllUsers as RequestHandler
);

export default router;
