import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === 'ACCOUNT_NOT_VALIDATED') {
                    throw new Error('Votre compte est en attente de validation par un administrateur');
                }
                throw new Error('Email ou mot de passe incorrect');
            }

            // Stockage synchrone des données utilisateur
            const userSession = {
                token: data.token,
                username: email,
                role: data.role,
                loginTime: new Date().getTime().toString(),
                isAuthenticated: 'true',
                justLoggedIn: 'true'
            };

            // Stocker toutes les données en une fois
            Object.entries(userSession).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

            console.log('Login successful, redirecting...', data.role); // Debug

            // Redirection basée sur le rôle
            if (data.role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else if (data.role === 'ROLE_USER') {
                // Stocker les données et rediriger immédiatement
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                localStorage.setItem('role', data.role);
                localStorage.setItem('username', email);
                
                // Redirection directe sans setTimeout
                navigate('/welcome');
            } else {
                throw new Error('Rôle utilisateur inconnu');
            }
        } catch (err) {
            setError(err.message);
            // Nettoyer en cas d'erreur
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1 className="form-title">Connexion</h1>

                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button 
                            className="retry-button"
                            onClick={() => setError('')}
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                        placeholder="Entrez votre email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Entrez votre mot de passe"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        'Se connecter'
                    )}
                </button>

                <div className="register-link">
                    Pas encore de compte ?
                    <a href="/register">S'inscrire</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;