import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getError } from '../services/api';
import MealForm from '../components/MealForm';

export default function NewMeal() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function save(values) {
    setSaving(true); setError('');
    try { const { data } = await api.post('/meals', values); navigate(`/meals/${data.meal.id}`, { replace: true }); }
    catch (err) { setError(getError(err)); }
    finally { setSaving(false); }
  }
  return <><h1>Nova refeição</h1><MealForm onSubmit={save} saving={saving} error={error} /></>;
}
