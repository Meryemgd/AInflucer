import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './UserWelcome.css';

const UserWelcome = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Utilisateur';
    const role = localStorage.getItem('role');

    useEffect(() => {
        // Si c'est un admin, redirection immédiate
        if (role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [role, navigate]);

    const handleSocialConnect = (platform) => {
        // Logique de connexion aux réseaux sociaux à implémenter
        console.log(`Connexion à ${platform}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleNext = () => {
        navigate('/dashboard');
    };

    return (
        <div className="welcome-page">
            <h1 className="welcome-title">
                Bienvenu {username}
            </h1>

            <p className="welcome-description">
                AInfluencer est là pour vous aider à améliorer votre performance 
                en réseaux sociaux dont vous avez objectif dessus (facebook, instagram, linkedin...), 
                pour bénéficier d'un IA community manager veuillez connecter vos comptes :
            </p>

            <div className="social-connect-container">
                <button 
                    className="social-btn facebook"
                    onClick={() => handleSocialConnect('facebook')}
                >
                    <FaFacebookF /> Facebook
                </button>

                <button 
                    className="social-btn instagram"
                    onClick={() => handleSocialConnect('instagram')}
                >
                    <FaInstagram /> Instagram
                </button>

                <button 
                    className="social-btn linkedin"
                    onClick={() => handleSocialConnect('linkedin')}
                >
                    <FaLinkedinIn /> LinkedIn
                </button>
            </div>

            <div className="nav-buttons">
                <button 
                    className="btn-logout"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>
                <button 
                    className="btn-next"
                    onClick={handleNext}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default UserWelcome;