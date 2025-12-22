"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./profile.module.css";

type Profile = {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    role: number | null;
};

export default function ProfileForm({
    profile,
    roles,
    }: {
    profile: Profile;
    roles: { id: number; name: string }[];
    }) {
    const supabase = createClient();

    const [firstname, setFirstname] = useState(profile.firstname ?? "");
    const [lastname, setLastname] = useState(profile.lastname ?? "");
    const [username, setUsername] = useState(profile.username ?? "");
    const [role, setRole] = useState<number | "">(profile.role ?? "");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(false);
        setError(null);

        const { error } = await supabase
        .from("profiles")
        .update({
            firstname: firstname || null,
            lastname: lastname || null,
            username: username || null,
            role: role === "" ? null : role,
        })
        .eq("id", profile.id);

        if (error) {
        setError(error.message);
        } else {
        setSaved(true);
        }
    };

    return (
        <form onSubmit={save} className={styles.form}>
            <div className={styles.field}>
                <label>Prénom</label>
                <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label>Nom</label>
                <input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label>Nom d’utilisateur</label>
                <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
            </div>

            <div className={styles.field}>
                <label>Pupitre</label>
                <select
                    value={role ?? ""}
                    onChange={(e) => setRole(Number(e.target.value))}
                    >
                    <option value="">— Choisir —</option>
                    {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.actions}>
                <button type="submit" className={styles.button}>
                Enregistrer
                </button>
                {saved && <span className={styles.success}>Profil mis à jour</span>}
            </div>
            </form>

    );
}
