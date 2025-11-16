import { supabase } from "../lib/supabase";

export async function generateAccessCode() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-access-code`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error generando código");

    return data; // { id, code, created_at, ... }
}
