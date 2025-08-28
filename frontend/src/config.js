export const API_BASE_URL = 'http://localhost:8080';
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_info';

export const ENDPOINTS = {
    LOGIN: `${API_AUTH_URL}/login`,
    REGISTER: `${API_AUTH_URL}/register`,
    LOGOUT: `${API_AUTH_URL}/logout`,
    GET_USER: `${API_AUTH_URL}/user`,
    // Ajoutez d'autres endpoints ici
};
