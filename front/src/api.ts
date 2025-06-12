import axios from 'axios';
import type { Task, TaskCreate, UserLogin, Token, UserSignup } from './types';

const API_BASE_URL = 'http://localhost:8000';

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
  const res = await axios.get(`${API_BASE_URL}/tasks/get_all`);
  return res.data;
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const res = await axios.post(`${API_BASE_URL}/tasks/create`, task);
  return res.data;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const res = await axios.delete(`${API_BASE_URL}/tasks/delete/${id}`);
  return res.data;
};

export const updateTask = async (id: number, task: TaskCreate): Promise<Task> => {
  const res = await axios.put(`${API_BASE_URL}/tasks/update/${id}`, task);
  return res.data;
};

export const login = async (user: UserLogin): Promise<Token> => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, user);
  return res.data;
};

export const signup = async (user: UserSignup): Promise<Token> => {
  const res = await axios.post(`${API_BASE_URL}/auth/signup`, user);
  return res.data;
};

export const sendMessageToAssistant = async (prompt: string): Promise<any> => {
  const res = await axios.post(`${API_BASE_URL}/assistant/chat`, { prompt, model: "gemini" });
  return res.data;
};

export async function* streamMessageToAssistant(prompt: string): AsyncGenerator<string> {
  const response = await fetch(`${API_BASE_URL}/assistant/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ prompt, model: "gemini" }),
  });

  if (!response.body) {
    throw new Error("ReadableStream not yet supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    yield decoder.decode(value);
  }
}
