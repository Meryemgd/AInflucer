import { API_BASE_URL } from '../config';

const HttpService = {
    async makeRequest(url, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

            if (!isAuthRequest && token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.exp * 1000 < Date.now()) {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                        return;
                    }
                } catch (e) {
                    console.error('Erreur lors de la vérification du token:', e);
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
            }

            const defaultHeaders = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const config = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                }
            };

            const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
            console.log('Envoi requête à:', fullUrl);
            
            const response = await fetch(fullUrl, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Erreur réseau');
            }
            const data = await response.json();
            console.log('Réponse reçue:', data);
            return data;
        } catch (error) {
            console.error('Erreur requête HTTP:', error);
            throw error;
        }
    },
    async get(url, options = {}) {
        return this.makeRequest(url, { 
            ...options, 
            method: 'GET' 
        });
    },
    
    async post(url, data, options = {}) {
        return this.makeRequest(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async put(url, data, options = {}) {
        return this.makeRequest(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    async delete(url, options = {}) {
        return this.makeRequest(url, {
            ...options,
            method: 'DELETE'
        });
    }
};

export default HttpService;
