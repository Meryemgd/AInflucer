const API_URL = 'http://localhost:8080/api/auth';

export async function register(username, password) {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
    return res.text();
}

export async function login(username, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
    return res.text();
}
