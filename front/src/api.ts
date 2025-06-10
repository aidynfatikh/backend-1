import axios from 'axios';
import type { Task, TaskCreate, UserLogin, Token, UserSignup } from './types';

const API_URL = 'http://localhost:8000/tasks';

// Add a request interceptor to include the token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getTasks = async (): Promise<Task[]> => {
  const res = await axios.get(`${API_URL}/get_all`);
  return res.data;
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const res = await axios.post(`${API_URL}/create`, task);
  return res.data;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const res = await axios.delete(`${API_URL}/delete/${id}`);
  return res.data;
};

export const updateTask = async (id: number, task: TaskCreate): Promise<Task> => {
  const res = await axios.put(`${API_URL}/update/${id}`, task);
  return res.data;
};

export const login = async (user: UserLogin): Promise<Token> => {
  const res = await axios.post(`${API_URL}/login`, user);
  return res.data;
};

export const signup = async (user: UserSignup): Promise<Token> => {
  const res = await axios.post(`${API_URL}/signup`, user);
  return res.data;
};
