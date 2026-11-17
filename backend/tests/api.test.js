import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createDatabase } from '../src/db.js';
import { createApp } from '../src/app.js';

const db = createDatabase(':memory:');
const app = createApp({ db, jwtSecret: 'test-secret-of-32-characters-minimum!!!!!' });
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}/api`;
after(() => { server.close(); db.close(); });

async function request(method, path, data, token) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  const body = response.status === 204 ? null : await response.json();
  return { status: response.status, body };
}

test('cadastro, autenticação, CRUD, métricas e isolamento entre usuários', async () => {
  let r = await request('POST', '/users', { name: 'Ana', email: 'ana@example.com', password: 'Senha123!' });
  assert.equal(r.status, 201);
  const ana = r.body.token;
  assert.ok(r.body.user.id);
  assert.equal(r.body.user.password_hash, undefined);
  assert.equal((await request('POST', '/users', { name: 'Ana', email: 'ana@example.com', password: 'Senha123!' })).status, 409);
  assert.equal((await request('POST', '/sessions', { email: 'ana@example.com', password: 'errada' })).status, 401);
  assert.equal((await request('GET', '/meals')).status, 401);
  assert.equal((await request('GET', '/me', undefined, ana)).body.user.name, 'Ana');

  r = await request('POST', '/users', { name: 'Bruno', email: 'bruno@example.com', password: 'Senha123!' });
  const bruno = r.body.token;
  const baseMeal = { name: 'Almoço', description: 'Arroz e feijão', eaten_at: '2026-11-16T12:00:00.000Z', is_on_diet: true };
  const dates = ['2026-11-16T10:00:00.000Z','2026-11-16T12:00:00.000Z','2026-11-16T14:00:00.000Z','2026-11-16T16:00:00.000Z'];
  const ids = [];
  for (let i = 0; i < 4; i++) {
    r = await request('POST', '/meals', { ...baseMeal, eaten_at: dates[i], is_on_diet: i !== 2 }, ana);
    assert.equal(r.status, 201);
    ids.push(r.body.meal.id);
  }
  assert.equal((await request('GET', '/meals', undefined, ana)).body.meals.length, 4);
  assert.equal((await request('GET', '/meals', undefined, bruno)).body.meals.length, 0);
  const metrics = (await request('GET', '/metrics', undefined, ana)).body.metrics;
  assert.deepEqual(metrics, { total: 4, on_diet: 3, off_diet: 1, best_streak: 2 });
  assert.equal((await request('GET', `/meals/${ids[0]}`, undefined, bruno)).status, 404);
  assert.equal((await request('PUT', `/meals/${ids[0]}`, baseMeal, bruno)).status, 404);
  assert.equal((await request('DELETE', `/meals/${ids[0]}`, undefined, bruno)).status, 404);
  assert.equal((await request('POST', '/meals', { ...baseMeal, is_on_diet: 'sim' }, ana)).status, 400);
  assert.equal((await request('PUT', `/meals/${ids[0]}`, { ...baseMeal, name: 'Editada' }, ana)).body.meal.name, 'Editada');
  assert.equal((await request('DELETE', `/meals/${ids[0]}`, undefined, ana)).status, 204);
  assert.equal((await request('GET', `/meals/${ids[0]}`, undefined, ana)).status, 404);
  assert.equal((await request('GET', '/metrics', undefined, ana)).body.metrics.total, 3);
});
