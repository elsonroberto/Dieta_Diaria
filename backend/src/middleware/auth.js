import jwt from 'jsonwebtoken';
import { httpError } from '../utils.js';

export function requireAuth(db, secret) {
  return (req, _res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) return next(httpError(401, 'Faça login para continuar.'));

    try {
      const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
      if (!payload || typeof payload.sub !== 'string') {
        return next(httpError(401, 'Token de acesso inválido.'));
      }
      const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(payload.sub);
      if (!user) return next(httpError(401, 'Usuário não encontrado.'));
      req.user = user;
      next();
    } catch {
      next(httpError(401, 'Sua sessão expirou ou é inválida.'));
    }
  };
}
