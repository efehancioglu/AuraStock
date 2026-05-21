import axios, { create } from 'axios';

const apiClient = axios.create(
    {
        baseURL: "http://localhost:5173/api",
        headers: {
            'Content-Type': 'application/json'
        }
    }
);

export default apiClient;