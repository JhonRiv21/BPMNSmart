import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route.ts';
import processRoutes from './routes/process.route.ts';

const app = express();
const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/process', processRoutes);

app.get('/', (req, res) => {
  res.send('Backend funcionandoo');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost/${port}`);
});
