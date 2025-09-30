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
    // baseURL: 'http://198.166.108.48:3333',
});

// export const authenticateUser = (email: string, password: string): Promise<AxiosResponse> => {
//     return api.post(`/login`, { email, password });
// };

export const authenticateUser = async (email: string, password: string): Promise<AxiosResponse> => {
    try {
        console.log('Attempting authentication for:', email);
        
        // Fetch users from my-json-server (GET request works)
        const usersResponse = await api.get('/users');
        const users = usersResponse.data;
        
        console.log('Found', users.length, 'users');
        
        // Find user with matching email
        const user = users.find((u: any) => u.email === email);
        
        if (!user) {
            console.log('User not found');
            throw new Error('User not found');
        }
        
        console.log('User found:', user.name.first, user.name.last);
        
        // Accept "password" as valid password
        if (password === 'password') {
            console.log('Authentication successful!');
            
            return {
                data: {
                    user: user,
                    accessToken: 'mock-token-' + Date.now()
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {}
            } as AxiosResponse;
        } else {
            console.log('Invalid password. Use "password"');
            throw new Error('Invalid password - use "password"');
        }
        
    } catch (error: any) {
        console.log('Authentication error:', error.message);
        throw new Error('Invalid credentials');
    }
};


