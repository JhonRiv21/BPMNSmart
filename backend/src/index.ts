import express from 'express';
import cors from 'cors';
import { PrismaClient } from "./generated/prisma/index.js";
import userRoutes from './routes/user.route'

const app = express();
const port = process.env.port || 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost/${port}`);
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users)
})