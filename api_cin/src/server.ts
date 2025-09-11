import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors'; 
import { PrismaClient } from '@prisma/client';
import routes from './routes'; 

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Middleware global para log de requests 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Conecta as rotas
app.use('/api', routes);

// Tratamento de erros global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Desconecta Prisma ao encerrar o app
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});