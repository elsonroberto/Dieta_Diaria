import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getError } from '../services/api';
import MealForm from '../components/MealForm';

export default function EditMeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api.get(`/meals/${id}`).then(({ data }) => { if (active) setMeal(data.meal); })
      .catch(err => { if (active) setError(getError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  async function save(values) {
    setSaving(true); setError('');
    try { await api.put(`/meals/${id}`, values); navigate(`/meals/${id}`, { replace: true }); }
    catch (err) { setError(getError(err)); }
    finally { setSaving(false); }
  }
  return <><h1>Editar refeição</h1>{loading ? <p>Carregando...</p> : meal ? <MealForm key={meal.id} initial={meal} onSubmit={save} saving={saving} error={error} backTo={`/meals/${id}`} /> : <><p className="error">{error}</p><Link to="/">Voltar</Link></>}</>;
}
