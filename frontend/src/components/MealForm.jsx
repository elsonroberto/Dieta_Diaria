import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toInputDateTime } from '../utils/dates';

export default function MealForm({ initial, onSubmit, saving, error, backTo = '/' }) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [dateTime, setDateTime] = useState(toInputDateTime(initial?.eaten_at || new Date()));
  const [isOnDiet, setIsOnDiet] = useState(initial?.is_on_diet === undefined ? '' : String(initial.is_on_diet));

  async function submit(event) {
    event.preventDefault();
    if (isOnDiet === '' || !dateTime) return;
    const date = new Date(dateTime);
    if (!Number.isFinite(date.getTime())) return;
    await onSubmit({ name: name.trim(), description: description.trim(), eaten_at: date.toISOString(), is_on_diet: isOnDiet === 'true' });
  }

  return <form className="panel form-panel" onSubmit={submit}>
    <label>Nome da refeição<input required maxLength="100" value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: Almoço" /></label>
    <label>Descrição<textarea required rows="3" maxLength="500" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex.: Arroz, feijão e salada" /></label>
    <label>Data e hora<input required type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} /></label>
    <label>Está dentro da dieta?
      <select required value={isOnDiet} onChange={e => setIsOnDiet(e.target.value)}>
        <option value="">Selecione</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
    </label>
    {error && <p className="error">{error}</p>}
    <div className="actions"><button type="submit" className="button" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button><Link className="button secondary" to={backTo}>Cancelar</Link></div>
  </form>;
}
