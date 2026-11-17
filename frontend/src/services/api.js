import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('daily-diet-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getError(error) {
  if (!error.response) return 'Não foi possível conectar à API. Verifique se o backend está funcionando.';
  return error.response.data?.error || 'Ocorreu um erro inesperado. Tente novamente.';
}
