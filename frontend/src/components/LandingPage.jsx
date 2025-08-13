import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { FaRobot, FaCalendarAlt, FaChartBar, FaShareAlt } from "react-icons/fa";

function LandingPage() {
    const navigate = useNavigate();

    // Fonctions de navigation pour une meilleure maintenabilité
    const goToLogin = () => navigate("/login");
    const goToRegister = () => navigate("/register");
    const goToDemo = () => navigate("/demo");

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    AInfluencer
                </div>
                <div className="nav-buttons">
                    <button
                        className="btn-secondary"
                        onClick={goToLogin}
                        aria-label="Aller à la page de connexion"
                    >
                        Connexion
                    </button>
                    <button
                        className="btn-primary"
                        onClick={goToRegister}
                        aria-label="Aller à la page d'inscription"
                    >
                        Inscription
                    </button>
                </div>
            </nav>

            {/* Section Hero */}
            <header className="hero colorful-bg">
                <div className="hero-text">
                    <h1>Boostez votre présence en ligne avec l'IA 🤖</h1>
                    <p>
                        Planifiez, créez et publiez vos contenus automatiquement
                        tout en suivant vos performances avec un dashboard intelligent.
                    </p>
                    <div className="buttons">
                        <button
                            className="btn-primary"
                            onClick={goToRegister}
                            aria-label="Commencer l'inscription"
                        >
                            Commencer
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={goToDemo}
                            aria-label="Voir la démonstration"
                        >
                            Voir Démo
                        </button>
                    </div>
                </div>
            </header>

            {/* Services / Fonctionnalités */}
            <section className="features">
                <h2>Nos Services</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <FaRobot className="feature-icon" />
                        <h3>Génération IA</h3>
                        <p>Créez des posts personnalisés grâce à notre IA spécialisée en réseaux sociaux.</p>
                    </div>
                    <div className="feature-card">
                        <FaCalendarAlt className="feature-icon" />
                        <h3>Planification intelligente</h3>
                        <p>Planifiez vos publications aux moments les plus engageants avec rappels automatiques.</p>
                    </div>
                    <div className="feature-card">
                        <FaChartBar className="feature-icon" />
                        <h3>Dashboard personnalisé</h3>
                        <p>Analysez vos vues, abonnés et taux d'engagement en temps réel.</p>
                    </div>
                    <div className="feature-card">
                        <FaShareAlt className="feature-icon" />
                        <h3>Multi-réseaux sociaux</h3>
                        <p>Publiez automatiquement sur Facebook, Instagram, LinkedIn et plus encore.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 AInfluencer - Community Management assisté par IA</p>
                <div className="footer-links">
                    <span onClick={() => navigate("/terms")}>Conditions d'utilisation</span>
                    <span onClick={() => navigate("/privacy")}>Politique de confidentialité</span>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;