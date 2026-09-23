import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const API = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true
});

export const registerUser = (data) => API.post('/user/register', data);
export const loginUser = (data) => API.post('/user/login', data);
export const getCurrentUser = () => API.get('/user');
export const createNewChat = (title) => API.post('/create/chat', { title });
export const getUserChats = () => API.get('/create/chats');
export const getChatMessages = (chatId) => API.get(`/create/messages/${chatId}`);
export const deleteChatApi = (chatId) => API.delete(`/create/chat/${chatId}`);
export const renameChatApi = (chatId, title) => API.patch(`/create/chat/${chatId}`, { title });

export default API;