import { Router } from 'express';
import passport from 'passport';
import { googleCallback, logout } from '../controller/auth.controller.ts';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  (req, res, next) => {
    console.log('=== CALLBACK RECIBIDO ===');
    console.log('Query:', req.query);
    console.log('Host:', req.get('host'));
    console.log('Protocol:', req.protocol);
    console.log('X-Forwarded-Proto:', req.get('x-forwarded-proto'));
    console.log('Full URL construida:', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
    
    // Verificar si es Railway
    const isRailway = req.get('host')?.includes('railway.app');
    console.log('Es Railway:', isRailway);
    console.log('=== FIN CALLBACK DEBUG ===');
    next();
  },
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}?error=auth_failed`,
    session: false
  }),
  googleCallback
);

router.post('/logout', logout);

router.get('/debug', (req, res) => {
  console.log('=== AUTH DEBUG ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  
  res.json({
    sessionId: req.sessionID,
    user: req.user,
    authenticated: req.isAuthenticated(),
    cookies: req.cookies,
    session: req.session
  });
});

export default router;