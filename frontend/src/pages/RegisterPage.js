// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!username || !email || !password || !password2) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        if (password !== password2) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (res.ok) {
                setSuccessMsg("Inscription réussie ! Vous allez être redirigé(e) vers la page de connexion...");
                setTimeout(() => navigate("/login"), 1200);
            } else {
                const text = await res.text();
                setError(text || "Erreur lors de l'inscription.");
            }
        } catch (err) {
            setError("Impossible de joindre le serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 480, margin: "100px auto", padding: 20 }}>
            <h2 style={{ textAlign: "center" }}>Inscription</h2>

            {error && (
                <div style={{ color: "white", background: "#e74c3c", padding: 10, borderRadius: 6, marginBottom: 12 }}>
                    {error}
                </div>
            )}

            {successMsg && (
                <div style={{ color: "white", background: "#2ecc71", padding: 10, borderRadius: 6, marginBottom: 12 }}>
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    style={{ padding: "10px 12px", fontSize: 16 }}
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    style={{ padding: "10px 12px", fontSize: 16 }}
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Mot de passe"
                    style={{ padding: "10px 12px", fontSize: 16 }}
                />

                <input
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    type="password"
                    placeholder="Confirmez le mot de passe"
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
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>

            <div style={{ marginTop: 14, textAlign: "center" }}>
                <span>Vous avez déjà un compte ? </span>
                <Link to="/login">Se connecter</Link>
            </div>
        </div>
    );
}
