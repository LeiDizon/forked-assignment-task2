import axios, { AxiosResponse } from 'axios';

const api = axios.create({

    //baseURL: 'http://38.55.70.207:3333',
    baseURL: 'http://localhost:3333',
    
});

// Remove testCredentials entirely
export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    // Send directly to server - let it validate against db.json
    return api.post(`/login`, { email, password });
};


