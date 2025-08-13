// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    // Ici on peut vérifier token dans localStorage si tu veux (prochaine étape)
    const handleLogout = () => {
        localStorage.removeItem("aif_token"); // si on stocke un token
        navigate("/");
    };

    return (
        <div style={{ maxWidth: 1000, margin: "100px auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Tableau de bord</h1>
                <div>
                    <button
                        onClick={() => navigate("/")}
                        style={{ marginRight: 8, padding: "8px 12px", borderRadius: 6 }}
                    >
                        Accueil
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 6,
                            background: "#e74c3c",
                            color: "white",
                            border: "none"
                        }}
                    >
                        Déconnexion
                    </button>
                </div>
            </div>

            <section style={{ marginTop: 20 }}>
                <h2>Bienvenue !</h2>
                <p>Voici le tableau de bord. Tu pourras intégrer ici :</p>
                <ul>
                    <li>Statistiques (vues, engagement)</li>
                    <li>Planification des publications</li>
                    <li>Génération IA & Aperçus</li>
                    <li>Comptes connectés (Instagram, Facebook, LinkedIn)</li>
                </ul>
            </section>
        </div>
    );
}
