import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes.js';
import { mealRoutes } from './routes/mealRoutes.js';
import { requireAuth } from './middleware/auth.js';
import { httpError } from './utils.js';

export function createApp({ db, jwtSecret, corsOrigin = 'http://localhost:5173' }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: corsOrigin.split(',').map((origin) => origin.trim()) }));
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  const auth = requireAuth(db, jwtSecret);
  // O Express 4 encaminha erros lançados por handlers síncronos.
  app.use('/api', authRoutes(db, jwtSecret, auth));
  app.use('/api', mealRoutes(db, auth));
  app.use((_req, _res, next) => next(httpError(404, 'Rota não encontrada.')));
  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return res.status(400).json({ error: 'JSON inválido.' });
    }
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600 ? error.status : 500;
    if (status === 500) console.error('[API]', error);
    return res.status(status).json({ error: status === 500 ? 'Erro interno no servidor.' : error.message });
  });
  return app;
}
