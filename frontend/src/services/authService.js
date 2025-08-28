import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            const data = response.data;
            console.log('Réponse du serveur:', data);
            
            if (!data || !data.token || !data.role) {
                console.error('Données manquantes dans la réponse:', data);
                throw new Error('Réponse invalide du serveur');
            }
            
            // S'assurer d'avoir un nom d'utilisateur, sinon utiliser le début de l'email
            const username = data.username || email.split('@')[0];
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', String(data.id));
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', username);
            localStorage.setItem('accountValidated', String(data.accountValidated));
            
            return data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Erreur de connexion');
            }
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('accountValidated');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const accountValidated = localStorage.getItem('accountValidated') === 'true';

        if (!token || !userId || !role || !username) {
            return null;
        }

        return {
            token,
            userId: Number(userId),
            roleName: role,
            username,
            accountValidated
        };
    }
};

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authService;
