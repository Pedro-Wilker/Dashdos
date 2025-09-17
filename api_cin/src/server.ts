import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import logger from './lib/logger';
import { userRoutes, amploGeralRoutes, produtividadeRoutes } from './routes'

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rate limiting for public endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Muitas requisições, tente novamente mais tarde' } }
});
app.use('/v1', limiter);

// Middleware global para log de requests
app.use((req, res, next) => {
  logger.info('Request received', { method: req.method, url: req.url });
  next();
});

// Conecta as rotas com prefixo /v1
app.use('/v1', userRoutes);
app.use('/v1', amploGeralRoutes);
app.use('/v1', produtividadeRoutes);

// Tratamento de erros global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Server error', { error: err.message, stack: err.stack, url: req.url });
  res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } });
});

// Desconecta Prisma ao encerrar o app
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('Prisma disconnected, server shutting down');
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});