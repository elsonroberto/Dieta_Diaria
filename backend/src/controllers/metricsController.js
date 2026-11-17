export function metricsController(db) {
  return (req, res) => {
    const meals = db.prepare(`SELECT is_on_diet FROM meals WHERE user_id = ?
      ORDER BY eaten_at ASC, created_at ASC, rowid ASC`).all(req.user.id);
    let onDiet = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    for (const meal of meals) {
      if (meal.is_on_diet === 1) {
        onDiet += 1;
        currentStreak += 1;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    res.json({
      metrics: {
        total: meals.length,
        on_diet: onDiet,
        off_diet: meals.length - onDiet,
        best_streak: bestStreak,
      },
    });
  };
}
