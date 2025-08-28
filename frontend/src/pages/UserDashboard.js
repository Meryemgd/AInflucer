import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const UserDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        completedTasks: 0,
        pendingTasks: 0,
        totalEarnings: 0
    });

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserData(data);
            
            setStats({
                completedTasks: 12,
                pendingTasks: 5,
                totalEarnings: 1500
            });

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            navigate('/login');
            return;
        }

        if (userId !== id) {
            navigate('/unauthorized');
            return;
        }

        fetchUserData();
    }, [id, navigate, fetchUserData]);

    if (loading) return <div className="dashboard-container">Chargement...</div>;
    if (error) return <div className="dashboard-container">Erreur: {error}</div>;
    if (!userData) return <div className="dashboard-container">Aucune donnée trouvée</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Tableau de bord</h1>
                <p>Bienvenue, {userData.username}</p>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Tâches Complétées</h3>
                    <p className="stat-value">{stats.completedTasks}</p>
                </div>
                <div className="stat-card">
                    <h3>Tâches en Attente</h3>
                    <p className="stat-value">{stats.pendingTasks}</p>
                </div>
                <div className="stat-card">
                    <h3>Gains Totaux</h3>
                    <p className="stat-value">{stats.totalEarnings} €</p>
                </div>
            </div>

            <div className="dashboard-content">
                <section className="recent-activity">
                    <h2>Activités Récentes</h2>
                    <div className="activity-list">
                        {/* À remplacer par de vraies données */}
                        <p>Aucune activité récente</p>
                    </div>
                </section>

                <section className="upcoming-tasks">
                    <h2>Tâches à Venir</h2>
                    <div className="task-list">
                        {/* À remplacer par de vraies données */}
                        <p>Aucune tâche à venir</p>
                    </div>
                </section>
            </div>

            <div className="user-profile">
                <section className="profile-info">
                    <h2>Informations du Profil</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Email:</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Nom:</label>
                            <p>{userData.name || 'Non renseigné'}</p>
                        </div>
                        <div className="info-item">
                            <label>Statut:</label>
                            <p>{userData.accountValidated ? 'Vérifié' : 'En attente de validation'}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
