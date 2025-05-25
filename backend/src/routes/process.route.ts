import { Router, RequestHandler } from 'express';
import { verifyToken } from '../middlewares/auth/auth.middleware.ts';
import * as processController from '../controller/process.controller.ts';
const router = Router();

router.get(
  '/',
  verifyToken as RequestHandler,
  processController.getMyProcess as RequestHandler
);
router.get(
  '/:id',
  verifyToken as RequestHandler,
  processController.getProcessById as RequestHandler
);
router.post(
  '/create',
  verifyToken as RequestHandler,
  processController.createProcess as RequestHandler
);
router.put(
  '/:id',
  verifyToken as RequestHandler,
  processController.updateProcess as RequestHandler
);
router.delete(
  '/:id',
  verifyToken as RequestHandler,
  processController.deleteProcess as RequestHandler
);

export default router;
