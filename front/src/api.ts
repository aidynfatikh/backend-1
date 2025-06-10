import axios from 'axios';
import type { Task, TaskCreate } from './types';

const API_URL = 'http://localhost:8000/tasks';

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
