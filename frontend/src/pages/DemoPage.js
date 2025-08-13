// src/pages/DemoPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DemoPage() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: 980, margin: "100px auto", padding: 20 }}>
            <h1 style={{ textAlign: "center" }}>Voir Démo</h1>

            <p style={{ textAlign: "center", marginBottom: 24 }}>
                Ici tu peux présenter une courte démo : une vidéo, un carrousel d'images
                ou une démo interactive de génération de contenu.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    Retour
                </button>

                <button
                    onClick={() => navigate("/register")}
                    style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#00C4CC",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Essayer maintenant (S'inscrire)
                </button>
            </div>

            {/* Placeholder de démonstration */}
            <div style={{ marginTop: 30, textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", padding: 12, borderRadius: 8, background: "#f8f8f8" }}>
                    <h3>Demo placeholder</h3>
                    <p>
                        Exemple : Aperçu de génération IA — le résultat s'affichera ici après
                        connexion ou via une API.
                    </p>
                </div>
            </div>
        </div>
    );
}
