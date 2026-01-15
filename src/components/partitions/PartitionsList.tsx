"use client";

import { useEffect, useState } from "react";
import styles from "./partitions.module.scss";
import AddPartitionButton from "./AddPartitionButton";
import { createClient } from "@/lib/supabase/client";

type Partition = {
    id: number;
    name: string;
    signedUrl: string | null;
    added_by: string;
};

export default function PartitionsList({
  partitions,
}: {
  partitions: Partition[];
}) {
    const supabase = createClient();
    const [query, setQuery] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const filtered = partitions.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();

            if (!data.user) return;

            setUserId(data.user.id);

            const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", data.user.id)
            .single();

            setIsAdmin(profile?.is_admin === true);
        };

        loadUser();
    }, []);

    return (
        <main className={styles.container}>
        <h1 className={styles.title}>🎼 Partitions</h1>

        
        <div>
            <input
                type="search"
                placeholder="Rechercher un chant…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.search}
            />
            <AddPartitionButton />
        </div>

        <ul className={styles.list}>
            {filtered.map((p) => { 
                const canEdit = isAdmin || p.added_by === userId;
                
                return (
                    <li key={p.id} className={styles.card}>
                        <span className={styles.name}>{p.name}</span>

                        <div className={styles.buttonsContainer}>
                            {p.signedUrl ? (
                            <a
                                href={p.signedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                📄 Ouvrir
                            </a>
                            ) : (
                            <span className={styles.disabled}>Lien indisponible</span>
                            )}

                            {canEdit && (
                            <button
                            className={styles.edit}
                            onClick={() => {
                                window.alert("Fonctionnalité de modification à venir !");
                            }}
                            >
                            ✏️ Modifier
                            </button>)}
                        </div>
                    </li>
                )})}
        </ul>

        {filtered.length === 0 && (
            <p className={styles.empty}>Aucun résultat</p>
        )}
        </main>
    );
}
