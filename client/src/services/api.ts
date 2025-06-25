import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/events',
});

export const getEvents = () => API.get('/');
export const createEvent = (data: any) => API.post('/', data);
export const updateEvent = (id: string, data: any) => API.put(`/${id}`, data);
export const deleteEvent = (id: string) => API.delete(`/${id}`);