import React, { useState } from 'react';
import { login } from '../services/authService';

export default function LoginForm({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            alert('Connexion réussie !');
            onSuccess();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: 300, margin: 'auto'}}>
            <h2>Connexion</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required />
            <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Se connecter</button>
        </form>
    );
}
