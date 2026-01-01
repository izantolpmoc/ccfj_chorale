"use client";

import { useState } from "react";
import styles from "./partitions.module.scss";

type Partition = {
    id: number;
    name: string;
    signedUrl: string | null;
};

export default function PartitionsList({
  partitions,
}: {
  partitions: Partition[];
}) {
    const [query, setQuery] = useState("");

    const filtered = partitions.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <main className={styles.container}>
        <h1 className={styles.title}>🎼 Partitions</h1>

        <input
            type="search"
            placeholder="Rechercher un chant…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
        />

        <ul className={styles.list}>
            {filtered.map((p) => (
            <li key={p.id} className={styles.card}>
                <span className={styles.name}>{p.name}</span>

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
            </li>
            ))}
        </ul>

        {filtered.length === 0 && (
            <p className={styles.empty}>Aucun résultat</p>
        )}
        </main>
    );
}
