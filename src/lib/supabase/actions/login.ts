"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const supabase = createClient(cookies());

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
