import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import styles from "./profile.module.css";

type Role = {
    id: number;
    name: string;
};

export default async function ProfilePage() {
    const supabase = createClient(cookies());

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: roles, error: rolesError } = await supabase
        .from("roles")
        .select("id, name")
        .order("name")
        .returns<Role[]>(); // ✅ clé ici

    if (rolesError || !roles) {
        return <p>Erreur lors du chargement des pupitres.</p>;
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return <p>Profil introuvable.</p>;
    }

    return (
        <main className={styles.page}>
            <div className={styles.card}>
            <h1 className={styles.title}>Mon profil</h1>
            <ProfileForm profile={profile} roles={roles} />
            </div>
        </main>
    );
}
