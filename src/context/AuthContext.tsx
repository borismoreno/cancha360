import {
    createContext,
    useContext,
    useEffect,
    useRef,
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

    // Guardas para evitar carreras y fetchs duplicados
    const initialRestoreDone = useRef(false);
    const lastFetchedId = useRef<string | null>(null);

    // Función auxiliar para cargar el perfil
    const loadProfile = async (userId: string) => {
        try {
            const { data: profileData, error } = await supabase
                .from("organizers")
                .select("*")
                .eq("id", userId)
                .maybeSingle();

            if (error) {
                console.error("❌ [Auth] Error cargando perfil:", error);
                return null;
            }

            lastFetchedId.current = profileData?.id ?? null;
            return profileData;
        } catch (err) {
            console.error("❌ [Auth] Excepción cargando perfil:", err);
            return null;
        }
    };

    // Setup del listener de auth PRIMERO
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {

            const currentUser = session?.user ?? null;

            // Evitar ejecutar fetchs hasta completar la restauración inicial
            if (!initialRestoreDone.current) {
                // manejar solo sign out pre-inicialización para limpiar estado
                if (event === "SIGNED_OUT") {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                }
                return;
            }

            setUser(currentUser);

            if (currentUser) {
                // evitar fetch duplicado si ya se obtuvo para el mismo id
                if (lastFetchedId.current !== currentUser.id) {
                    const profileData = await loadProfile(currentUser.id);
                    setProfile(profileData ?? null);
                } else {
                    console.log("ℹ️ [Auth] Perfil ya obtenido para id=", currentUser.id);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Restaurar sesión inicial
    useEffect(() => {
        const restoreSession = async () => {

            try {
                const { data, error } = await supabase.auth.getUser();

                if (error) {
                    console.error("❌ [Auth] Error getUser:", error.message);
                    setLoading(false);
                    return;
                }

                if (data?.user) {
                    setUser(data.user);
                    const profileData = await loadProfile(data.user.id);
                    setProfile(profileData ?? null);
                }
            } catch (err) {
                console.error("❌ [Auth] Excepción restaurando sesión:", err);
            } finally {
                setLoading(false);
                initialRestoreDone.current = true; // marcar que la restauración inicial terminó
            }
        };

        restoreSession();
    }, []);

    // Logout
    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("❌ [Auth] Error en logout:", err);
        } finally {
            setUser(null);
            setProfile(null);
            // Limpiar el id fetchado para forzar reload al volver a iniciar sesión
            lastFetchedId.current = null;
        }
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