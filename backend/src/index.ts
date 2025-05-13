import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost/${port}`);
});