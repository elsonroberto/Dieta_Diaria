import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getError } from '../services/api';

export default function AuthPage({ type }) {
  const registering = type === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (registering) await register(name, email, password);
      else await login(email, password);
      navigate('/', { replace: true });
    } catch (err) { setError(getError(err)); }
    finally { setBusy(false); }
  }

  return <main className="auth-wrap">
    <div className="panel">
      <h1>Daily Diet</h1>
      <h2>{registering ? 'Criar conta' : 'Entrar'}</h2>
      <form onSubmit={submit}>
        {registering && <label>Nome<input required minLength="2" maxLength="80" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" /></label>}
        <label>E-mail<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" /></label>
        <label>Senha<input required type="password" minLength={registering ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" /></label>
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit" disabled={busy}>{busy ? 'Aguarde...' : registering ? 'Cadastrar' : 'Entrar'}</button>
      </form>
      <p className="centered">{registering ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
        <Link to={registering ? '/login' : '/register'}>{registering ? 'Fazer login' : 'Cadastrar'}</Link>
      </p>
    </div>
  </main>;
}
