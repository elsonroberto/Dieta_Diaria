import { randomUUID } from 'node:crypto';
import { httpError, toPublicMeal, validateMeal } from '../utils.js';

export function mealController(db) {
  function getOwnedMeal(id, userId) {
    const meal = db.prepare('SELECT * FROM meals WHERE id = ? AND user_id = ?').get(id, userId);
    if (!meal) throw httpError(404, 'Refeição não encontrada.');
    return meal;
  }

  return {
    list(req, res) {
      const meals = db.prepare('SELECT * FROM meals WHERE user_id = ? ORDER BY eaten_at DESC, created_at DESC')
        .all(req.user.id).map(toPublicMeal);
      res.json({ meals });
    },

    show(req, res) {
      res.json({ meal: toPublicMeal(getOwnedMeal(req.params.id, req.user.id)) });
    },

    create(req, res) {
      const values = validateMeal(req.body);
      const now = new Date().toISOString();
      const meal = { id: randomUUID(), user_id: req.user.id, ...values, created_at: now, updated_at: now };
      db.prepare(`INSERT INTO meals (id, user_id, name, description, eaten_at, is_on_diet, created_at, updated_at)
        VALUES (@id, @user_id, @name, @description, @eaten_at, @is_on_diet, @created_at, @updated_at)`).run(meal);
      res.status(201).json({ meal: toPublicMeal(meal) });
    },

    update(req, res) {
      getOwnedMeal(req.params.id, req.user.id);
      const values = validateMeal(req.body);
      const updatedAt = new Date().toISOString();
      db.prepare(`UPDATE meals SET name = @name, description = @description, eaten_at = @eaten_at,
        is_on_diet = @is_on_diet, updated_at = @updated_at WHERE id = @id AND user_id = @user_id`)
        .run({ ...values, updated_at: updatedAt, id: req.params.id, user_id: req.user.id });
      res.json({ meal: toPublicMeal(getOwnedMeal(req.params.id, req.user.id)) });
    },

    remove(req, res) {
      getOwnedMeal(req.params.id, req.user.id);
      db.prepare('DELETE FROM meals WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
      res.status(204).end();
    },
  };
}
