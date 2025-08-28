import React, { useState } from 'react';
import AuthService from '../services/authService';

export default function RegisterForm({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        
        // Validation basique
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.register(username, email, password, role);
            onSuccess();
        } catch (err) {
            console.error('Erreur lors de l\'inscription:', err);
            setError(err.message || 'Une erreur est survenue lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: 300, margin: 'auto'}}>
            <h2>Inscription</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            <div style={{marginBottom: '1rem'}}>
                <input
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{width: '100%', padding: '0.5rem'}}
                    required
                />
            </div>

            <div style={{marginBottom: '1rem'}}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{width: '100%', padding: '0.5rem'}}
                    required
                />
            </div>

            <div style={{marginBottom: '1rem'}}>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{width: '100%', padding: '0.5rem'}}
                    required
                />
            </div>

            <div style={{marginBottom: '1rem'}}>
                <input
                    type="password"
                    placeholder="Confirmez le mot de passe"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{width: '100%', padding: '0.5rem'}}
                    required
                />
            </div>

            <div style={{marginBottom: '1rem'}}>
                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                >
                    <option value="ROLE_USER">Utilisateur</option>
                    <option value="ROLE_ADMIN">Administrateur</option>
                </select>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#00bfa5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            >
                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
        </form>
    );
}
