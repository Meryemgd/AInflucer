import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HttpService from '../services/httpService';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [stats, setStats] = useState({
        totalUsers: 0,
        validatedUsers: 0,
        pendingUsers: 0
    });
    // States removed: selectedUser, menu/menuAnchorEl, activeUserId (non utilisés)

    // NOTE: fetchUsers défini en dehors du useEffect pour clarté. Ne pas l'ajouter dans les deps
    // afin d'éviter les relances multiples dues au mécanisme de retry basé sur retryCount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await HttpService.get('/api/admin/users');
            
            console.log('Réponse brute:', response);
            
            // S'assurer que la réponse est un tableau
            const userData = Array.isArray(response) ? response : 
                           Array.isArray(response.data) ? response.data : 
                           response.users ? response.users : [];
            
            // Traiter les données des utilisateurs
            const processedData = userData.map(user => ({
                id: user.id,
                username: user.username || user.name || '',
                email: user.email || '',
                role: user.role || user.authorities?.[0]?.authority || 'ROLE_USER',
                accountValidated: user.role === 'ROLE_ADMIN' ? true : user.accountValidated || false,
                lastLoginDate: user.lastLoginDate || user.lastLogin || null,
                createdAt: user.createdAt || user.dateCreated || null,
                updatedAt: user.updatedAt || user.dateModified || null
            }));

            console.log('Utilisateurs traités:', processedData);
            setUsers(processedData);
            
            // Calcul des statistiques à partir des données réelles
            setStats({
                totalUsers: processedData.length,
                validatedUsers: processedData.filter(user => user.accountValidated).length,
                pendingUsers: processedData.filter(user => !user.accountValidated).length
            });
            setError('');
            
            const newStats = {
                totalUsers: processedData.length,
                validatedUsers: processedData.filter(u => u.accountValidated).length,
                pendingUsers: processedData.filter(u => !u.accountValidated).length,
                activeUsers: processedData.filter(u => u.lastLoginDate && new Date(u.lastLoginDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
                userRoles: {
                    admin: processedData.filter(u => u.role === 'ROLE_ADMIN').length,
                    user: processedData.filter(u => u.role === 'ROLE_USER').length
                }
            };
            setStats(newStats);
            
        } catch (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            
            if (err.response) {
                setError(err.response.data?.message || 'Erreur lors de la récupération des utilisateurs');
            } else if (err.request) {
                if (retryCount < 3) {
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                        fetchUsers();
                    }, 2000);
                    setError('Tentative de reconnexion au serveur...');
                } else {
                    setError('Impossible de contacter le serveur. Veuillez rafraîchir la page.');
                }
            } else {
                setError('Une erreur inattendue est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // exécution une seule fois au montage
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleValidateAccount = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await HttpService.put(`/api/admin/users/${userId}/validate`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            await fetchUsers();
            
        } catch (err) {
            console.error('Erreur lors de la validation du compte:', err);
            setError('Erreur lors de la validation du compte');
        }
    };

    const handleModifyUser = async (user) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // À implémenter: Logique de modification (peut ouvrir une modale ou rediriger vers une page de modification)
            console.log('Modification de l\'utilisateur:', user);
        } catch (err) {
            console.error('Erreur lors de la modification du compte:', err);
            setError('Erreur lors de la modification du compte');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                await HttpService.delete(`/api/admin/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                await fetchUsers();
            }
        } catch (err) {
            console.error('Erreur lors de la suppression du compte:', err);
            setError('Erreur lors de la suppression du compte');
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await HttpService.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await fetchUsers();
        } catch (err) {
            console.error('Erreur lors du changement de rôle:', err);
            setError('Erreur lors du changement de rôle');
        }
    };

    const chartData = {
        labels: ['Utilisateurs validés', 'Utilisateurs en attente'],
        datasets: [
            {
                data: [stats.validatedUsers, stats.pendingUsers],
                backgroundColor: ['#4CAF50', '#FFC107'],
                borderColor: ['#388E3C', '#FFA000'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="admin-dashboard">
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchUsers}>
                        Réessayer
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="loading">
                    <p>Chargement...</p>
                </div>
            ) : (
                <>
                    <div className="dashboard-header">
                        <h1>Tableau de bord Administrateur</h1>
                        <button className="logout-button" onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}>
                            Déconnexion
                        </button>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Utilisateurs</h3>
                            <p>{stats.totalUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>En attente</h3>
                            <p>{stats.pendingUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Validés</h3>
                            <p>{stats.validatedUsers}</p>
                        </div>
                    </div>

                    <div className="users-section">
                        <h2>Gestion des utilisateurs</h2>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th>Actions principales</th>
                                    <th>Gestion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge ${user.role === 'ROLE_ADMIN' ? 'role-admin' : 'role-user'}`}>
                                                {user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.accountValidated ? 'status-valide' : 'status-attente'}`}>
                                                {user.accountValidated ? 'Validé' : 'En attente'}
                                            </span>
                                        </td>
                                        <td>
                                            {!user.accountValidated && (
                                                <button
                                                    className="validate-btn"
                                                    onClick={() => handleValidateAccount(user.id)}
                                                >
                                                    Valider
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="modify-btn"
                                                    onClick={() => handleModifyUser(user)}
                                                >
                                                    Modifier
                                                </button>
                                                <div className="dropdown">
                                                    <button className="more-btn">...</button>
                                                    <div className="dropdown-content">
                                                        <button onClick={() => handleChangeRole(user.id, user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN')}>
                                                            {user.role === 'ROLE_ADMIN' ? 'Retirer admin' : 'Faire admin'}
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
