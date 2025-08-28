import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const handleLogout = useCallback(() => {
        localStorage.clear(); // Nettoyer toutes les données de session
        navigate("/login");
    }, [navigate]);

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }
            
            // Vérifier si l'utilisateur accède à son propre dashboard
            if (userId !== userProfile.id.toString()) {
                setError('Accès non autorisé');
                navigate('/');
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setUserData(response.data);
            setError(null);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors du chargement des données utilisateur:', err);
            setError('Erreur lors du chargement des données utilisateur');
            setLoading(false);
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    }, [handleLogout, userId, userProfile.id, navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleValidation = useCallback(async (userId, validate) => {
        try {
            const token = localStorage.getItem('aif_token');
            if (!token) {
                handleLogout();
                return;
            }

            const endpoint = validate ? 'validate' : 'invalidate';
            await axios.put(
                `http://localhost:8080/api/users/${userId}/${endpoint}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            await fetchUserData();
        } catch (err) {
            console.error('Erreur lors de la modification du statut:', err);
            setError('Erreur lors de la modification du statut');
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    }, [fetchUserData, handleLogout]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('fr-FR');
    };

    if (loading) return <div className="text-center mt-5">Chargement...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <Container fluid className="dashboard-container py-4">
            <Row className="mb-4">
                <Col>
                    <Card className="dashboard-header">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">Tableau de Bord Administrateur</h2>
                            <Button variant="outline-danger" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="dashboard-table">
                        <Card.Body>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom d'utilisateur</th>
                                            <th>Email</th>
                                            <th>Rôle</th>
                                            <th>Statut</th>
                                            <th>Créé le</th>
                                            <th>Dernière connexion</th>
                                            <th>Sessions</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userData && (
                                            <tr>
                                                <td>{userData.id}</td>
                                                <td>{userData.username}</td>
                                                <td>{userData.email}</td>
                                                <td>
                                                    <Badge bg={userData.roleName === 'ROLE_ADMIN' ? 'danger' : 'info'}>
                                                        {userData.roleName?.replace('ROLE_', '')}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={userData.accountValidated ? 'success' : 'warning'}>
                                                        {userData.accountValidated ? 'Validé' : 'En attente'}
                                                    </Badge>
                                                </td>
                                                <td>{formatDate(userData.createdAt)}</td>
                                                <td>{formatDate(userData.lastLogin)}</td>
                                                <td>{userData.sessionCount}</td>
                                                <td>
                                                    {userData.roleName !== 'ROLE_ADMIN' && (
                                                        <Button
                                                            variant={userData.accountValidated ? 'danger' : 'success'}
                                                            size="sm"
                                                            onClick={() => handleValidation(userData.id, !userData.accountValidated)}
                                                        >
                                                            {userData.accountValidated ? 'Invalider' : 'Valider'}
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
