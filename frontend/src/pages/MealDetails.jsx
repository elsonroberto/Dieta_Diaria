import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getError } from '../services/api';
import { formatDate, formatTime } from '../utils/dates';

export default function MealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    let active = true;
    api.get(`/meals/${id}`).then(({ data }) => { if (active) setMeal(data.meal); })
      .catch(err => { if (active) setError(getError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  async function remove() {
    if (!window.confirm('Deseja excluir esta refeição?')) return;
    setDeleting(true); setError('');
    try { await api.delete(`/meals/${id}`); navigate('/', { replace: true }); }
    catch (err) { setError(getError(err)); setDeleting(false); }
  }
  return <>
    <h1>Detalhes da refeição</h1>
    {loading ? <p>Carregando...</p> : !meal ? <p className="error">{error}</p> : <section className="panel details">
      <h2>{meal.name}</h2>
      <p><strong>Descrição:</strong> {meal.description}</p>
      <p><strong>Data e hora:</strong> {formatDate(meal.eaten_at)} às {formatTime(meal.eaten_at)}</p>
      <p><strong>Na dieta:</strong> {meal.is_on_diet ? 'Sim' : 'Não'}</p>
      {error && <p className="error">{error}</p>}
      <div className="actions"><Link to={`/meals/${id}/edit`} className="button">Editar</Link><button className="button danger" disabled={deleting} onClick={remove}>{deleting ? 'Excluindo...' : 'Excluir'}</button><Link to="/" className="button secondary">Voltar</Link></div>
    </section>}
  </>;
}
