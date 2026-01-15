"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./profile.module.css";

type Profile = {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    role: number | null;
    is_admin: boolean;
};

type Role = {
    id: number;
    name: string;
};

export default function ProfileForm({
    profile,
    roles,
    }: {
    profile: Profile;
    roles: Role[];
}) {
    const supabase = createClient();

    const [firstname, setFirstname] = useState(profile.firstname ?? "");
    const [lastname, setLastname] = useState(profile.lastname ?? "");
    const [username, setUsername] = useState(profile.username ?? "");
    const [role, setRole] = useState<number | "">(profile.role ?? "");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async (e: FormEvent<HTMLFormElement>) => {
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFirstname(e.target.value)
            }
            />
        </div>

        <div className={styles.field}>
            <label>Nom</label>
            <input
            value={lastname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLastname(e.target.value)
            }
            />
        </div>

        <div className={styles.field}>
            <label>Nom d&apos;utilisateur</label>
            <input
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
            }
            required
            />
        </div>

        <div className={styles.field}>
            <label>Pupitre</label>
            <select
            value={role ?? ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setRole(Number(e.target.value))
            }
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
            {error && <span className={styles.error}>Erreur : {error}</span>}
        </div>
        </form>
    );
}
