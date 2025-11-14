import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

// ============================
// Tipos
// ============================
export interface OrganizerProfile {
    id: string;
    full_name: string;
    email: string;
    organization_name: string | null;
    is_active: boolean;
    is_superadmin: boolean;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: any | null;
    profile: OrganizerProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ============================
// Provider
// ============================
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<OrganizerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // ----------------------------------------------------------------------
    // 1) Restaurar sesión inicial (IMPORTANTE: getUser() para SPA)
    // ----------------------------------------------------------------------
    useEffect(() => {
        const loadSession = async () => {
            console.log("🔍 [Auth] Restaurando sesión inicial…");

            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error("❌ [Auth] Error getUser:", error.message);
            }

            const sessionUser = data?.user ?? null;
            setUser(sessionUser);

            if (sessionUser) {
                const { data: profileData } = await supabase
                    .from("organizers")
                    .select("*")
                    .eq("id", sessionUser.id)
                    .maybeSingle();

                setProfile(profileData ?? null);
            } else {
                setProfile(null);
            }

            setLoading(false);
        };

        loadSession();
    }, []);

    // ----------------------------------------------------------------------
    // 2) Listener para login / logout / refresh tokens
    // ----------------------------------------------------------------------
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("⚡ [Auth] Evento:", event);

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const { data: profileData } = await supabase
                    .from("organizers")
                    .select("*")
                    .eq("id", currentUser.id)
                    .maybeSingle();

                setProfile(profileData ?? null);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // ----------------------------------------------------------------------
    // 3) Logout
    // ----------------------------------------------------------------------
    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setLoading(false);
    };

    const value: AuthContextType = {
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================
// Hook de acceso
// ============================
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}
