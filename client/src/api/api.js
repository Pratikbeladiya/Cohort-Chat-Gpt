import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

export const registerUser = (data) => API.post('/user/register', data);
export const loginUser = (data) => API.post('/user/login', data);
export const getCurrentUser = () => API.get('/user');
export const createNewChat = (title) => API.post('/create/chat', { title });
export const getUserChats = () => API.get('/create/chats');
export const getChatMessages = (chatId) => API.get(`/create/messages/${chatId}`);

export default API;