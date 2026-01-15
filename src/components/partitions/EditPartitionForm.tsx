"use client";

import { useState } from "react";
import styles from "./edit-partition.module.scss";

type Props = {
    partition: {
        id: number;
        name: string;
        page: number | null;
        audio_link: string | null;
        chant_types: number[];
    };
    onClose: () => void;
    onSuccess: () => void;
};

export default function EditPartitionForm({
    partition,
    onClose,
    onSuccess,
}: Props) {
    const [name, setName] = useState(partition.name);
    const [page, setPage] = useState<number | "">(partition.page ?? "");
    const [audio, setAudio] = useState(partition.audio_link ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
        const res = await fetch(`/api/partitions/${partition.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            name,
            page: page === "" ? null : page,
            audio_link: audio || null,
            }),
        });

        if (!res.ok) throw new Error();

        onSuccess();
        onClose();
        } catch {
        setError("Erreur lors de la modification");
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className={styles.form}>
        <h2>✏️ Modifier la partition</h2>

        <label>
            Nom
            <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
            Page
            <input
            type="number"
            value={page}
            onChange={(e) =>
                setPage(e.target.value === "" ? "" : Number(e.target.value))
            }
            />
        </label>

        <label>
            Lien audio
            <input
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            placeholder="https://…"
            />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
            <button type="button" onClick={onClose}>
            Annuler
            </button>
            <button disabled={loading}>
            {loading ? "Enregistrement…" : "Enregistrer"}
            </button>
        </div>
        </form>
    );
}
