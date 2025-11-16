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
import { OrganizerRoute } from "./OrganizarRoute";
import AccessCodes from "../pages/superadmin/AccessCodes";

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Rutas organizador */}
            <Route element={<ProtectedRoute />}>
                <Route element={<OrganizerRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Route>

            {/* Rutas sólo Superadmin */}
            <Route element={<ProtectedRoute />}>
                <Route element={<SuperAdminRoute />}>
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    <Route path="/superadmin/codigos" element={<AccessCodes />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
