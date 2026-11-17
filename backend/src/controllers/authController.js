import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { httpError, toPublicUser } from '../utils.js';

function signToken(user, secret) {
  return jwt.sign({}, secret, { subject: user.id, expiresIn: '7d', algorithm: 'HS256' });
}

export function authController(db, secret) {
  return {
    register(req, res) {
      const { name, email, password } = req.body || {};
      if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
        throw httpError(400, 'Informe um nome de 2 a 80 caracteres.');
      }
      if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw httpError(400, 'Informe um email válido.');
      }
      if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        throw httpError(400, 'A senha deve conter entre 8 e 128 caracteres.');
      }
      const normalizedEmail = email.trim().toLowerCase();
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)) {
        throw httpError(409, 'Este email já está cadastrado.');
      }
      const user = {
        id: randomUUID(), name: name.trim(), email: normalizedEmail, created_at: new Date().toISOString(),
      };
      const passwordHash = bcrypt.hashSync(password, 10);
      db.prepare('INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(user.id, user.name, user.email, passwordHash, user.created_at);
      res.status(201).json({ user: toPublicUser(user), token: signToken(user, secret) });
    },

    login(req, res) {
      const { email, password } = req.body || {};
      if (typeof email !== 'string' || typeof password !== 'string') {
        throw httpError(400, 'Informe email e senha.');
      }
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        throw httpError(401, 'Email ou senha incorretos.');
      }
      res.json({ user: toPublicUser(user), token: signToken(user, secret) });
    },

    me(req, res) {
      res.json({ user: toPublicUser(req.user) });
    },
  };
}
