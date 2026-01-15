"use client";

import { useState } from "react";
import type { ChantType } from "@/types/chant-type";
import styles from "./upload-partition.module.scss";

export default function UploadPartitionForm({
  chantTypes,
}: {
  chantTypes: ChantType[];
}) {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [audio, setAudio] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number | "">("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const toggleType = (id: number) => {
        setSelectedTypes((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);
        formData.append("audio_link", audio);
        formData.append("types", JSON.stringify(selectedTypes));
        if (page !== "") {
            formData.append("page", page.toString());
        }

        try {
            const res = await fetch("/api/partitions", {
            method: "POST",
            body: formData,
            });

            if (!res.ok) {
            throw new Error("Erreur lors de l’ajout de la partition");
            }

            // ✅ succès
            setSuccess("Partition ajoutée avec succès 🎶");

            // 🔄 reset du formulaire
            setName("");
            setFile(null);
            setSelectedTypes([]);
            setPage("");
            setAudio("");

            // reset input file (important)
            (document.getElementById("file-input") as HTMLInputElement).value = "";

        } catch (err) {
            setError("Une erreur est survenue. Merci de réessayer.");
        } finally {
            setLoading(false);
        }
        };


    return (
        <form onSubmit={submit} className={styles.form}>
        <h2 className={styles.title}>➕ Ajouter une partition</h2>

        <div className={styles.field}>
            <label>Nom de la partition</label>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex : Sanctus – Messe de Saint Boniface"
            />
        </div>

        <div className={styles.field}>
            <label>Fichier PDF</label>
            <input
            id="file-input"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            />
        </div>

        <div className={styles.field}>
            <label>URL de l&apos;audio (optionnel)</label>
            <input
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            placeholder="https://www.youtube.com/watch?v="
            />
        </div>

        <div className={styles.field}>
            <label>
            Page dans le carnet
            <span className={styles.hint}>
                ( Si aucune valeur n&apos;est renseignée, le chant sera indiqué comme n&apos;étant pas dans le carnet.)
            </span>
            </label>
            <input
            type="number"
            min={1}
            value={page}
            onChange={(e) =>
                setPage(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="ex : 42"
            />
        </div>

        <fieldset className={styles.types}>
            <legend>Type de chant</legend>

            <div className={styles.typeGrid}>
            {chantTypes.map((t) => (
                <label
                key={t.id}
                className={`${styles.type} ${
                    selectedTypes.includes(t.id) ? styles.active : ""
                }`}
                >
                <input
                    type="checkbox"
                    checked={selectedTypes.includes(t.id)}
                    onChange={() => toggleType(t.id)}
                />
                {t.name}
                </label>
            ))}
            </div>
        </fieldset>

        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <button disabled={loading} className={styles.submit}>
            {loading ? "Envoi…" : "Ajouter la partition"}
        </button>
        </form>
    );
}
