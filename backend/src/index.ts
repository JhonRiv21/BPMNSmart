import express from 'express';
import session from 'express-session';
import passport from './auth/passport.ts';
import cors from 'cors';
import userRoutes from './routes/user.route.ts';
import processRoutes from './routes/process.route.ts';
import authRouter from './routes/auth.route.ts';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.set('trust proxy', true);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
      return;
    }
    next();
  });
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://bpmn-smart.vercel.app',
      'https://bpmnsmart.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'Set-Cookie',
      'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: ['Set-Cookie'],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/process', processRoutes);

// Wake up DB and backend
app.get('/health', async (_req, res) => {
  try {
    await prisma.user.findFirst();
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (e) {
    console.error('Healthcheck failed:', e);
    res.status(500).json({ status: 'fail', error: String(e) });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'No encontrado' });
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
);

app.listen(port, () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const serverUrl = isProduction
    ? `https://bpmnsmart.onrender.com`
    : `http://localhost:${port}`;

  console.log(`Servidor corriendo en ${serverUrl}`);
  console.log(`Puerto: ${port}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
