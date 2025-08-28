import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSignOutAlt,
  FaArrowRight,
  FaUser
} from "react-icons/fa";
import "./WelcomeDashboard.css";

function WelcomeDashboard() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    // Vérification plus complète
    if (!token || !storedEmail || !role) {
        localStorage.clear(); // Nettoyer le localStorage
        navigate('/login');
        return;
    }

    // Récupération du nom
    const storedName = localStorage.getItem('name');
    if (storedName) {
        setUsername(storedName);
    } else {
        const nameFromEmail = storedEmail.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        setUsername(formattedName);
        localStorage.setItem('name', formattedName);
    }

    setUserEmail(storedEmail);
  }, [navigate]);

  const handleSocialConnect = (platform) => {
    setConnecting(platform);
    setTimeout(() => {
      setConnecting("connected-" + platform);
      setTimeout(() => setConnecting(""), 2000);
    }, 1500);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <FaChartLine className="logo-icon" />
          <div className="logo-text">AInfluencer</div>
        </div>
        <div className="user-info">
          <FaUser className="user-icon" />
          <span>{username}</span>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Bienvenue, {username} !
        </h1>
        {userEmail && <p className="user-email">{userEmail}</p>}

        <div className="description">
          <p>
            AInfluencer est là pour vous aider à améliorer votre performance
            sur les réseaux sociaux.
          </p>
          <p>
            Nous rassemblons une collection de réseaux sociaux dont vous avez
            besoin (Facebook, Instagram, LinkedIn) pour bénéficier d'un IA
            community manager.
          </p>
          <p>
            Connectez vos comptes pour commencer à optimiser votre présence en
            ligne.
          </p>
        </div>
      </div>

      {/* Social Section */}
      <div className="social-section">
        <h2 className="section-title">Connectez Vos Réseaux Sociaux</h2>

        <div className="social-buttons">
          <button
            className={`social-btn facebook-btn ${
              connecting.includes("facebook") ? "connecting" : ""
            }`}
            onClick={() => handleSocialConnect("facebook")}
            disabled={connecting.includes("facebook")}
          >
            <FaFacebookF className="social-icon" />
            <span>Facebook</span>
            {connecting.includes("facebook") && <span className="connecting-spinner"></span>}
          </button>

          <button
            className={`social-btn instagram-btn ${
              connecting.includes("instagram") ? "connecting" : ""
            }`}
            onClick={() => handleSocialConnect("instagram")}
            disabled={connecting.includes("instagram")}
          >
            <FaInstagram className="social-icon" />
            <span>Instagram</span>
            {connecting.includes("instagram") && <span className="connecting-spinner"></span>}
          </button>

          <button
            className={`social-btn linkedin-btn ${
              connecting.includes("linkedin") ? "connecting" : ""
            }`}
            onClick={() => handleSocialConnect("linkedin")}
            disabled={connecting.includes("linkedin")}
          >
            <FaLinkedinIn className="social-icon" />
            <span>LinkedIn</span>
            {connecting.includes("linkedin") && <span className="connecting-spinner"></span>}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn logout-btn"
          onClick={() => {
            if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
              localStorage.removeItem('email');
              localStorage.removeItem('name');
              navigate("/login");
            }
          }}
        >
          <FaSignOutAlt />
          Déconnexion
        </button>

        <button
          className="btn next-btn"
          onClick={() => navigate("/dashboard")}
        >
          Suivant
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default WelcomeDashboard;