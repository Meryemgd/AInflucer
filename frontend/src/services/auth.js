// src/services/auth.js
const API_BASE = "http://localhost:8080/api/auth";

/**
 * register({ username, email, password })
 * returns: { ok: true } ou { ok: false, error: "..." }
 */
export async function register({ username, email, password }) {
    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            return { ok: true };
        } else {
            const text = await res.text();
            return { ok: false, error: text || "Erreur serveur" };
        }
    } catch (err) {
        return { ok: false, error: err.message || "Impossible de joindre le serveur" };
    }
}

/**
 * login({ usernameOrEmail, password })
 * returns: { ok: true, token } ou { ok: false, error }
 * Note: backend devrait renvoyer un token JWT dans { token: "..." } pour production.
 */
export async function login({ usernameOrEmail, password }) {
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: usernameOrEmail, password }),
        });

        if (res.ok) {
            // si backend renvoie JSON
            try {
                const data = await res.json();
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", String(data.id));
                    localStorage.setItem("role", data.role);
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("accountValidated", String(data.accountValidated));
                }
                return { ok: true, ...data };
            } catch {
                // backend renvoie texte simple
                return { ok: true };
            }
        } else {
            if (res.status === 401) return { ok: false, error: "Identifiants invalides" };
            const text = await res.text();
            return { ok: false, error: text || "Erreur serveur" };
        }
    } catch (err) {
        return { ok: false, error: err.message || "Impossible de joindre le serveur" };
    }
}

export function logout() {
    localStorage.removeItem("aif_token");
}
