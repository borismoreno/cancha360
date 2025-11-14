import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { SuperAdminRoute } from "./SuperAdminRoute";

// Páginas (ejemplo)
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import { SuperAdminDashboard } from "../pages/superadmin/SuperAdminDashboard";

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Rutas privadas (organizador autenticado) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* aquí irían /partidos, /equipos, /configuracion, etc. */}

                {/* Rutas sólo Superadmin */}
                <Route element={<SuperAdminRoute />}>
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
