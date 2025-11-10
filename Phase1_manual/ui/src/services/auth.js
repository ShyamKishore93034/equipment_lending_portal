import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/user/login', { email, password });
  return res.data;
};

export const signup = async (name, email, password, role) => {
  const res = await api.post('/user/signup', { name, email, password, role });
  return res.data;
};