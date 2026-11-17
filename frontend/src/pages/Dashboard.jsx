import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getError } from '../services/api';
import { formatDate, formatTime } from '../utils/dates';

export default function Dashboard() {
  const [meals, setMeals] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, on_diet: 0, off_diet: 0, best_streak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [mealResponse, metricResponse] = await Promise.all([api.get('/meals'), api.get('/metrics')]);
      setMeals(mealResponse.data.meals);
      setMetrics(metricResponse.data.metrics);
    } catch (err) { setError(getError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return <>
    <div className="title-row">
      <h1>Minhas refeições</h1>
      <Link className="button" to="/meals/new">+ Nova refeição</Link>
    </div>
    <section className="metrics" aria-label="Métricas">
      <div><strong>{metrics.total}</strong><span>Total</span></div>
      <div><strong>{metrics.on_diet}</strong><span>Dentro da dieta</span></div>
      <div><strong>{metrics.off_diet}</strong><span>Fora da dieta</span></div>
      <div><strong>{metrics.best_streak}</strong><span>Maior sequência</span></div>
    </section>
    <section className="panel">
      <h2>Refeições cadastradas</h2>
      {loading ? <p>Carregando...</p> : error ? <><p className="error">{error}</p><button onClick={load}>Tentar novamente</button></> : meals.length === 0 ? <p>Nenhuma refeição cadastrada.</p> : <div className="meal-list">
        {meals.map(meal => <Link to={`/meals/${meal.id}`} className="meal-item" key={meal.id}>
          <span><strong>{meal.name}</strong><small>{formatDate(meal.eaten_at)} às {formatTime(meal.eaten_at)}</small></span>
          <span className={meal.is_on_diet ? 'tag yes' : 'tag no'}>{meal.is_on_diet ? 'Dentro' : 'Fora'}</span>
        </Link>)}
      </div>}
    </section>
  </>;
}
