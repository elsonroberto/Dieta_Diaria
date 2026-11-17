import test from 'node:test';
import assert from 'node:assert/strict';
import { httpError, toPublicMeal, validateMeal } from '../src/utils.js';
import { metricsController } from '../src/controllers/metricsController.js';

test('valida os campos e converte a data para ISO', () => {
  const meal = validateMeal({ name: '  Café ', description: ' Com frutas ', eaten_at: '2026-11-16T10:30:00Z', is_on_diet: true });
  assert.deepEqual(meal, { name: 'Café', description: 'Com frutas', eaten_at: '2026-11-16T10:30:00.000Z', is_on_diet: 1 });
  assert.throws(() => validateMeal({ ...meal, is_on_diet: 1 }), /dentro ou fora/);
  assert.throws(() => validateMeal({ ...meal, name: '' }), /nome/);
  assert.throws(() => validateMeal({ ...meal, description: '' }), /descrição/);
  assert.throws(() => validateMeal({ ...meal, eaten_at: 'inválido' }), /data e hora/);
});

test('resposta pública não inclui user_id', () => {
  assert.deepEqual(toPublicMeal({ id:'1', user_id:'private', name:'Almoço', description:'teste', eaten_at:'x', is_on_diet:1, created_at:'x', updated_at:'x' }), {
    id:'1', name:'Almoço', description:'teste', eaten_at:'x', is_on_diet:true, created_at:'x', updated_at:'x',
  });
});

test('calcula total, dentro, fora e maior sequência em ordem de data', () => {
  const fakeDb = { prepare: () => ({ all: () => [{is_on_diet:1},{is_on_diet:1},{is_on_diet:0},{is_on_diet:1},{is_on_diet:1},{is_on_diet:1},{is_on_diet:0}] }) };
  let data;
  metricsController(fakeDb)({ user: { id: 'a' } }, { json: (result) => { data = result; } });
  assert.deepEqual(data.metrics, { total:7, on_diet:5, off_diet:2, best_streak:3 });
});

test('retorna métricas zeradas para diário vazio', () => {
  let result;
  metricsController({ prepare: () => ({ all: () => [] }) })({user:{id:'x'}}, {json:(x)=>{result=x;}});
  assert.deepEqual(result.metrics, { total:0, on_diet:0, off_diet:0, best_streak:0 });
});
