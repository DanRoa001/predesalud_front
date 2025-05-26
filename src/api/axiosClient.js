import axios from "axios";

export const crediexpressAPI = axios.create({
    baseURL: 'http://localhost:3006/api/demo',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const apiColombia = axios.create({
    baseURL: 'https://api-colombia.com/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});