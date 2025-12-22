"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./login.module.scss";

export default function LoginPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
        },
        });

        if (error) {
        setError(error.message);
        } else {
        setSent(true);
        }
    };

    return (
        <main className={styles.page}>
        <div className={styles.card}>
            <h1 className={styles.title}>Connexion</h1>

            {sent ? (
            <p className={`${styles.message} ${styles.success}`}>
                📩 Un lien de connexion a été envoyé par email.
            </p>
            ) : (
            <form onSubmit={handleLogin} className={styles.form}>
                <input
                type="email"
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                />
                <button type="submit" className={styles.button}>
                Recevoir un lien
                </button>
            </form>
            )}

            {error && <p className={styles.error}>{error}</p>}
        </div>
        </main>
    );
}
