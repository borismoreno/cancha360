import { Routes, Route, Navigate } from "react-router-dom";
import { useRouteGuard } from "../hooks/useRouteGuard";

// Páginas (ejemplo)
import Dashboard from "../pages/admin/Dashboard";
import { Login } from "../pages/auth/Login";
import { SignUp } from "../pages/auth/SignUp";
import NotFound from "../pages/NotFound";
import { SuperAdminDashboard } from "../pages/superadmin/SuperAdminDashboard";
import AccessCodes from "../pages/superadmin/AccessCodes";
import Organizers from "../pages/superadmin/Organizers";
import Activate from "../pages/accesscode/Activate";
import Request from "../pages/accesscode/Request";
import TournamentData from "../pages/onboarding/TournamentData";
import TournamentRules from "../pages/onboarding/TournamentRules";
import TournamentTeams from "../pages/onboarding/TournamentTeams";
import TournamentFixture from "../pages/onboarding/TournamentFixture";
import Matches from "../pages/matches/Matches";
import EditMatch from "../pages/matches/EditMatch";

export const AppRouter = () => {
    const { loading } = useRouteGuard();

    if (loading) return <div>Cargando...</div>;
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/partidos/:tournamentId" element={<Matches />} />
            <Route path="/partidos/editar/:id" element={<EditMatch />} />
            <Route path="/activacion" element={<Activate />} />
            <Route path="/solicitar-codigo" element={<Request />} />
            <Route path="/onboarding/campeonato/datos" element={<TournamentData />} />
            <Route path="/onboarding/campeonato/reglas" element={<TournamentRules />} />
            <Route path="/onboarding/campeonato/equipos" element={<TournamentTeams />} />
            <Route path="/onboarding/campeonato/fixture" element={<TournamentFixture />} />
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/codigos" element={<AccessCodes />} />
            <Route path="/superadmin/organizadores" element={<Organizers />} />

            <Route path="/" element={<Navigate to='/dashboard' />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
