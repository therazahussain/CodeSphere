import axios from 'axios';


const api = axios.create({
    // http/localhost:5500/auth/api/send-otp
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});

// List of all the endpoints

// to generate and get otp on the entered phone
export const sendCode = (data) => api.post('/api/code-output', data);