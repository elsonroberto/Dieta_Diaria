export function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, created_at: user.created_at };
}

export function toPublicMeal(meal) {
  return {
    id: meal.id,
    name: meal.name,
    description: meal.description,
    eaten_at: meal.eaten_at,
    is_on_diet: Boolean(meal.is_on_diet),
    created_at: meal.created_at,
    updated_at: meal.updated_at,
  };
}

export function validateMeal(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'Envie os dados da refeição.');
  }
  const { name, description, eaten_at, is_on_diet } = body;
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    throw httpError(400, 'O nome deve ter entre 1 e 100 caracteres.');
  }
  if (typeof description !== 'string' || !description.trim() || description.trim().length > 500) {
    throw httpError(400, 'A descrição deve ter entre 1 e 500 caracteres.');
  }
  if (typeof eaten_at !== 'string' || !/^\d{4}-\d\d-\d\dT/.test(eaten_at) || !Number.isFinite(Date.parse(eaten_at))) {
    throw httpError(400, 'Informe uma data e hora válidas no formato ISO 8601.');
  }
  if (typeof is_on_diet !== 'boolean') {
    throw httpError(400, 'Informe se a refeição está dentro ou fora da dieta.');
  }
  return {
    name: name.trim(),
    description: description.trim(),
    eaten_at: new Date(eaten_at).toISOString(),
    is_on_diet: Number(is_on_diet),
  };
}
