// src/AppRoutes.js
import { useRoutes } from 'react-router-dom';
import HomePage from './components/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DemoPage from './pages/DemoPage';

export default function AppRoutes() {
    const routes = useRoutes([
        { path: '/', element: <HomePage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/demo', element: <DemoPage /> },
    ]);

    return routes;
}