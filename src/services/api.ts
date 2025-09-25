import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    // Before running your 'json-server', get your computer's IP address and
    // update your baseURL to `http://your_ip_address_here:3333` and then run:
    // `npx json-server --watch db.json --port 3333 --host your_ip_address_here`
    //
    // To access your server online without running json-server locally,
    // you can set your baseURL to:
    // `https://my-json-server.typicode.com/<your-github-username>/<your-github-repo>`
    //
    // To use `my-json-server`, make sure your `db.json` is located at the repo root.

    // baseURL: 'http://38.55.70.207:3333',
    baseURL: 'https://my-json-server.typicode.com/LeiDizon/forked-assignment-task2',
});

export const testCredentials = [
    { email: 'ulla.ulriksen@example.com', password: 'password123' }, // You'll need to know the original passwords
    { email: 'yasemin.akyuz@example.com', password: 'password123' },
    { email: 'luigi@carluccio.it', password: 'password123' },
    { email: 'john@silva.com.br', password: 'password123' },
    { email: 'elif.aksit@example.com', password: 'password123' },
];

export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
    // Check locally first
    const isValidLocally = testCredentials.some(cred =>
        cred.email === email && cred.password === password
    );

    if (!isValidLocally) {
        return Promise.reject(new Error('Invalid credentials'));
    }

    // If valid locally, proceed with server request
    return api.post(`/login`, { email, password });
};

