import { Router } from 'express';
import { mealController } from '../controllers/mealController.js';
import { metricsController } from '../controllers/metricsController.js';

export function mealRoutes(db, auth) {
  const router = Router();
  const controller = mealController(db);
  router.use(auth);
  router.get('/metrics', metricsController(db));
  router.get('/meals', controller.list);
  router.post('/meals', controller.create);
  router.get('/meals/:id', controller.show);
  router.put('/meals/:id', controller.update);
  router.delete('/meals/:id', controller.remove);
  return router;
}
