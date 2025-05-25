import { Router } from 'express';
import passport from 'passport';
import { googleCallback, logout } from '../controller/auth.controller.ts';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    session: false 
  }),
  googleCallback
);

router.post('/logout', logout);

export default router;