import express from 'express';
import session from 'express-session';
import passport from './auth/passport.ts';
import cors from 'cors';
import userRoutes from './routes/user.route.ts';
// import processRoutes from './routes/process.route.ts';
import authRouter from './routes/auth.route.ts'
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api/users', userRoutes);
// app.use('/api/process', processRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'No encontrado' });
});
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});