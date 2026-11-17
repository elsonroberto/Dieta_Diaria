import { Router } from 'express';
import { authController } from '../controllers/authController.js';

export function authRoutes(db, secret, auth) {
  const router = Router();
  const controller = authController(db, secret);
  router.post('/users', controller.register);
  router.post('/sessions', controller.login);
  router.get('/me', auth, controller.me);
  return router;
}
