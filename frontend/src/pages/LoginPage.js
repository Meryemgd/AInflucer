// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (!usernameOrEmail || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameOrEmail,
                    password: password,
                }),
            });

            if (res.ok) {
                // si le backend renvoie un token, on devrait le récupérer ici
                // const data = await res.json();
                // localStorage.setItem("token", data.token);

                // redirection vers le dashboard
                navigate("/dashboard");
            } else if (res.status === 401) {
                setError("Identifiants invalides.");
            } else {
                const text = await res.text();
                setError(text || "Erreur lors de la connexion.");
            }
        } catch (err) {
            setError("Impossible de joindre le serveur.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "120px auto", padding: 20 }}>
            <h2 style={{ textAlign: "center" }}>Connexion</h2>

            {error && (
                <div style={{ color: "white", background: "#e74c3c", padding: 10, borderRadius: 6, marginBottom: 12 }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="Nom d'utilisateur ou email"
                    style={{ padding: "10px 12px", fontSize: 16 }}
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Mot de passe"
                    style={{ padding: "10px 12px", fontSize: 16 }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "12px 16px",
                        borderRadius: 30,
                        border: "none",
                        background: "#00C4CC",
                        color: "white",
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>

            <div style={{ marginTop: 14, textAlign: "center" }}>
                <span>Pas encore inscrit ? </span>
                <Link to="/register">Créer un compte</Link>
            </div>
        </div>
    );
}
