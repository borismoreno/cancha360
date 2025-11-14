export function mapSupabaseAuthError(errorMessage: string): string {
    if (errorMessage.includes("password")) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (errorMessage.includes("already registered")) {
        return "Este email ya está registrado.";
    }

    if (errorMessage.includes("invalid email")) {
        return "El email ingresado no es válido.";
    }

    // fallback general
    return "No se pudo crear la cuenta. Inténtalo nuevamente.";
}
