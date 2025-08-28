import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { FaRobot, FaChartBar, FaShareAlt } from "react-icons/fa";

function LandingPage() {
    const navigate = useNavigate();

    // Restauration des fonctions de navigation simples et efficaces
    const goToLogin = () => navigate("/login");
    const goToRegister = () => navigate("/register");
    const goToDemo = () => navigate("/demo");

    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="logo">AInfluencer</div>
                <div className="nav-buttons">
                    <button className="btn-secondary" onClick={goToLogin}>
                        Connexion
                    </button>
                    <button className="btn-primary" onClick={goToRegister}>
                        S'inscrire
                    </button>
                </div>
            </nav>

            <main className="hero colorful-bg">
                <div className="hero-text">
                    <h1>Gérez vos réseaux sociaux avec l'IA</h1>
                    <p>
                        Optimisez votre présence en ligne avec notre IA
                        qui gère intelligemment vos comptes sociaux
                    </p>
                    <div className="buttons">
                        <button className="btn-primary" onClick={goToRegister}>
                            Commencer Gratuitement
                        </button>
                        <button className="btn-secondary" onClick={goToDemo}>
                            Voir la Démo
                        </button>
                    </div>
                </div>
            </main>

            <section className="features">
                <h2>Fonctionnalités</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <FaRobot className="feature-icon" />
                        <h3>IA Avancée</h3>
                        <p>Gestion intelligente de vos publications</p>
                    </div>
                    <div className="feature-card">
                        <FaChartBar className="feature-icon" />
                        <h3>Analytiques</h3>
                        <p>Suivez vos performances en temps réel</p>
                    </div>
                    <div className="feature-card">
                        <FaShareAlt className="feature-icon" />
                        <h3>Multi-Plateformes</h3>
                        <p>Gérez tous vos réseaux depuis une interface</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;