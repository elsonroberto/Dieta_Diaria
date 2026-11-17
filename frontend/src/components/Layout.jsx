import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  return <>
    <header className="header">
      <div className="header-inner">
        <Link className="logo" to="/">Daily Diet</Link>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/meals/new">Nova refeição</Link>
          <button className="link-button" onClick={logout}>Sair</button>
        </nav>
      </div>
    </header>
    <main className="container">
      <p className="welcome">Usuário: {user?.name}</p>
      <Outlet />
    </main>
  </>;
}
