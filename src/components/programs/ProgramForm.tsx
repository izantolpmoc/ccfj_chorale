"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChantType } from "@/types/chant-type";
import type { LiturgicalTime } from "@/types/liturgical-time";
import { PartitionSelect } from "@/types/partition-select";
import styles from "./ProgramForm.module.scss";

type Props = {
  chantTypes: ChantType[];
  partitions: PartitionSelect[];
  liturgicalTimes: LiturgicalTime[];
};

export default function ProgramForm({
chantTypes,
partitions,
liturgicalTimes,
}: Props) {
    const router = useRouter();

    const [date, setDate] = useState("");
    const [liturgicalId, setLiturgicalId] = useState<number | "">("");
    const [selected, setSelected] = useState<Record<number, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [queries, setQueries] = useState<Record<number, string>>({});
    
    function getFilteredPartitions(
        chantTypeId: number,
        query: string
        ) {
        const q = query.toLowerCase();

        return partitions
            .filter((p) => p.name.toLowerCase().includes(q))
            .sort((a, b) => {
            const aMatch = a.partition_types?.some(
                (pt) => pt.chant_type_id === chantTypeId
            );
            const bMatch = b.partition_types?.some(
                (pt) => pt.chant_type_id === chantTypeId
            );

            return Number(bMatch) - Number(aMatch); // priorité
            });
        }


    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            date,
            liturgical_id: liturgicalId || null,
            selections: selected,
        }),
        });

        if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
        }

        router.push("/programs");
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <h1>Nouveau programme</h1>

            <div className={styles.section}>
                <label className={styles.label}>Date</label>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={styles.input}
                />
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Temps liturgique</label>
                <select
                value={liturgicalId}
                onChange={(e) => setLiturgicalId(Number(e.target.value))}
                className={styles.select}
                >
                <option value="">—</option>
                {liturgicalTimes.map((l) => (
                    <option key={l.id} value={l.id}>
                    {l.name}, Année {l.year_cycle}
                    </option>
                ))}
                </select>
            </div>

            <hr className={styles.hr} />

            {chantTypes.map((ct) => {
                const query = queries[ct.id] ?? "";
                const filtered = getFilteredPartitions(ct.id, query);

                return (
                    <div key={ct.id} className={styles.chantCard}>
                    <div className={styles.chantTitle}>{ct.name}</div>

                    <input
                        type="text"
                        placeholder="Rechercher un chant…"
                        value={query}
                        onChange={(e) =>
                        setQueries({ ...queries, [ct.id]: e.target.value })
                        }
                        className={styles.searchInput}
                    />

                    {query && (
                        <div className={styles.results}>
                        {filtered.slice(0, 6).map((p) => {
                            const isPriority = p.partition_types?.some(
                            (pt) => pt.chant_type_id === ct.id
                            );

                            return (
                            <div
                                key={p.id}
                                className={`${styles.resultItem} ${
                                isPriority ? styles.priority : ""
                                }`}
                                onClick={() => {
                                setSelected({ ...selected, [ct.id]: p.id });
                                setQueries({ ...queries, [ct.id]: p.name });
                                }}
                            >
                                {p.name} {isPriority && "⭐"}
                            </div>
                            );
                        })}
                        </div>
                    )}

                    {selected[ct.id] && (
                        <div className={styles.selected}>
                        ✔️{" "}
                        {partitions.find((p) => p.id === selected[ct.id])?.name}
                        </div>
                    )}
                    </div>
                );
            })}


            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submit}>
                Créer le programme
            </button>

        </form>

    );
}
