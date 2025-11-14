import { supabase } from '../lib/supabase';
import { mapSupabaseAuthError } from '../utils/errors';

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    organizationName?: string | null;
}

export interface ServiceResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export async function registerOrganizer(
    payload: RegisterPayload
): Promise<ServiceResponse<{ userId: string | null }>> {
    // 1. Crear usuario en Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
            data: {
                full_name: payload.fullName,
                organization_name: payload.organizationName ?? null,
            },
        },
    });

    // ❌ Error en signup
    if (signUpError) {
        return {
            success: false,
            message: mapSupabaseAuthError(signUpError.message),
        };
    }

    const user = signUpData.user;

    // ⚠ Puede pasar si la verificación por email está activada
    if (!user) {
        return {
            success: true,
            message: "Revisa tu correo para activar tu cuenta.",
            data: { userId: null },
        };
    }

    // 2. Crear registro en la tabla organizers
    const { error: profileError } = await supabase.from("organizers").insert({
        id: user.id,
        full_name: payload.fullName,
        email: payload.email,
        organization_name: payload.organizationName ?? null,
    });

    // ❌ Error al insertar organizador
    if (profileError) {
        return {
            success: false,
            message: `Error al crear perfil: ${profileError.message}`,
        };
    }

    // ✔ éxito
    return {
        success: true,
        message: "Cuenta creada correctamente.",
        data: { userId: user.id },
    };
}

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, session: data.session };
}