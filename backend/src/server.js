import 'dotenv/config';
import { createDatabase } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3333);
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  console.error('Defina JWT_SECRET no arquivo .env com pelo menos 32 caracteres.');
  process.exit(1);
}
const db = createDatabase(process.env.DATABASE_FILE);
const app = createApp({ db, jwtSecret: secret, corsOrigin: process.env.CORS_ORIGIN });
const server = app.listen(port, () => console.log(`API Daily Diet: http://localhost:${port}/api`));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
}
