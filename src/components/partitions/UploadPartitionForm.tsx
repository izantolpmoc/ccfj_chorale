"use client";

import { useState } from "react";
import type { ChantType } from "@/types/chant-type";

export default function UploadPartitionForm({
    chantTypes,
    }: {
    chantTypes: ChantType[];
    }) {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number | "">("");


    const toggleType = (id: number) => {
        setSelectedTypes((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);
        formData.append("types", JSON.stringify(selectedTypes));
        if (page !== "") {
            formData.append("page", page.toString());
        }

        await fetch("/api/partitions", {
            method: "POST",
            body: formData,
        });

        setLoading(false);
    };

    return (
        <form onSubmit={submit}>
        <label>
            Nom de la partition
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
        </label>

        <label>
            Fichier PDF
            <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            />
        </label>

        <label>
            Page dans le carnet
            <input
                type="number"
                min={1}
                value={page}
                contextMenu="Si aucune valeur n'est renseignée, le chant sera indiqué comme n'étant pas dans le carnet."
                onChange={(e) => setPage(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="ex : 42"
            />
        </label>


        <fieldset>
            <legend>Type de chant</legend>
            {chantTypes.map((t) => (
            <label key={t.id}>
                <input
                type="checkbox"
                checked={selectedTypes.includes(t.id)}
                onChange={() => toggleType(t.id)}
                />
                {t.name}
            </label>
            ))}
        </fieldset>

        <button disabled={loading}>
            {loading ? "Envoi..." : "Ajouter"}
        </button>
        </form>
    );
}
