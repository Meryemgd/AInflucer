import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import DemoPage from './pages/DemoPage';
import LandingPage from './components/LandingPage';
import WelcomeDashboard from './pages/WelcomeDashboard';

// Import lazy-loaded
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

function ProtectedRoute({ children, adminOnly = false, requiredRole = null }) {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            
            if (!token || !role) {
                setHasAccess(false);
                setLoading(false);
                navigate('/login');
                return;
            }

            // ✅ Vérifie uniquement l'accès (ne redirige plus de force ici)
            setHasAccess(
                adminOnly ? role === 'ROLE_ADMIN' : 
                requiredRole ? role === requiredRole : true
            );

            setLoading(false);
        };

        checkAccess();
    }, [adminOnly, requiredRole, navigate]);

    if (loading) return <div>Chargement...</div>;
    if (!hasAccess) return <Navigate to="/login" replace />;
    return children;
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Page d'accueil publique */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentification */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/demo" element={<DemoPage />} />

            {/* Tableau de bord utilisateur normal */}
            <Route 
                path="/welcome" 
                element={
                    <ProtectedRoute>
                        <WelcomeDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Tableau de bord admin (réservé, inchangé) */}
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute adminOnly={true}>
                        <Suspense fallback={<div>Chargement...</div>}>
                            <AdminDashboard />
                        </Suspense>
                    </ProtectedRoute>
                } 
            />

            {/* Route catch-all → redirige vers LandingPage */}
            <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
            />
        </Routes>
    );
}
