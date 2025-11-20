import { Routes, Route, Navigate } from "react-router-dom";
import { useRouteGuard } from "../hooks/useRouteGuard";

// Páginas (ejemplo)
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import { SuperAdminDashboard } from "../pages/superadmin/SuperAdminDashboard";
import AccessCodes from "../pages/superadmin/AccessCodes";
import Organizers from "../pages/superadmin/Organizers";
import Activate from "../pages/accesscode/Activate";
import Request from "../pages/accesscode/Request";
import TournamentData from "../pages/onboarding/TournamentData";

export const AppRouter = () => {
    const { loading } = useRouteGuard();

    if (loading) return <div>Cargando...</div>;
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activacion" element={<Activate />} />
            <Route path="/solicitar-codigo" element={<Request />} />
            {/* <Route element={<PublicRoute />}>
            </Route> */}

            {/* Rutas organizador */}
            {/* <Route element={<ProtectedRoute />}>
                <Route element={<OrganizerRoute />}>
                </Route>
            </Route> */}

            {/* Rutas sólo Superadmin */}
            {/* <Route element={<ProtectedRoute />}>
                <Route element={<SuperAdminRoute />}>
                </Route>
            </Route> */}
            <Route path="/onboarding/campeonato/datos" element={<TournamentData />} />
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/codigos" element={<AccessCodes />} />
            <Route path="/superadmin/organizadores" element={<Organizers />} />

            <Route path="/" element={<Navigate to='/dashboard' />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
