import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import styles from "./header.module.scss";

export default async function Header() {
    const supabase = createClient(cookies());

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className={styles.header}>
        <div className={styles.inner}>
            <Link href="/" className={styles.logo}>
            🎶 Chorale CCFJ
            </Link>

            <nav className={styles.nav}>
            {user ? (
                <>
                <Link href="/profile" className={styles.link}>
                    Mon profil
                </Link>

                <form action="/auth/logout" method="post">
                    <button className={styles.button}>Déconnexion</button>
                </form>
                </>
            ) : (
                <Link href="/login" className={styles.button}>
                Connexion
                </Link>
            )}
            </nav>
        </div>
        </header>
    );
}
