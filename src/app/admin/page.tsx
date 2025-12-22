import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const supabase = createClient(cookies());

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) redirect("/");

    return (
        <main>
        <h1>Admin</h1>
        <p>Bienvenue administrateur 👑</p>
        </main>
    );
}
