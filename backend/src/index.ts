import express from 'express';
import session from 'express-session';
import passport from './auth/passport.ts';
import cors from 'cors';
import userRoutes from './routes/user.route.ts';
import processRoutes from './routes/process.route.ts';
import authRouter from './routes/auth.route.ts'
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 4000;

app.set('trust proxy', 1);

console.log('=== CONFIGURACIÓN RAILWAY ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', port);
console.log('PUBLIC_API_URL:', process.env.PUBLIC_API_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('=== FIN DEBUG ===');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://bpmn-smart.vercel.app',
    'https://bpmnsmart-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/process', processRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'No encontrado' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const serverUrl = isProduction 
    ? `https://bpmnsmart-production.up.railway.app` 
    : `http://localhost:${port}`;
  
  console.log(`🚀 Servidor corriendo en ${serverUrl}`);
  console.log(`📍 Puerto: ${port}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});