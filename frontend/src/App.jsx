import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NewMeal from './pages/NewMeal';
import EditMeal from './pages/EditMeal';
import MealDetails from './pages/MealDetails';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Carregando...</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<AuthPage type="login" />} />
    <Route path="/register" element={<AuthPage type="register" />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meals/new" element={<NewMeal />} />
        <Route path="/meals/:id" element={<MealDetails />} />
        <Route path="/meals/:id/edit" element={<EditMeal />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider></BrowserRouter>;
}
