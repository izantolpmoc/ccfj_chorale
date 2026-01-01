"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChantType } from "@/types/chant-type";
import type { LiturgicalTime } from "@/types/liturgical-time";
import { PartitionSelect } from "@/types/partition-select";

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
        <form onSubmit={submit}>
        <h1>Nouveau programme</h1>

        <label>
            Date
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            />
        </label>

        <label>
            Temps liturgique
            <select
            value={liturgicalId}
            onChange={(e) => setLiturgicalId(Number(e.target.value))}
            >
            <option value="">—</option>
            {liturgicalTimes.map((l) => (
                <option key={l.id} value={l.id}>
                {l.name}, Année {l.year_cycle}
                </option>
            ))}
            </select>
        </label>

        <hr />

        {chantTypes.map((ct) => {
            const query = queries[ct.id] ?? "";
            const filtered = getFilteredPartitions(ct.id, query);

            return (
                <div key={ct.id} style={{ marginBottom: "1.5rem" }}>
                <strong>{ct.name}</strong>

                <input
                    type="text"
                    placeholder="Rechercher un chant…"
                    value={query}
                    onChange={(e) =>
                    setQueries({ ...queries, [ct.id]: e.target.value })
                    }
                    style={{ display: "block", width: "100%", margin: "0.5rem 0" }}
                />

                {query && (
                    <ul style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {filtered.slice(0, 6).map((p) => {
                        const isPriority = p.partition_types?.some(
                        (pt) => pt.chant_type_id === ct.id
                        );

                        return (
                        <li
                            key={p.id}
                            style={{
                            cursor: "pointer",
                            fontWeight: isPriority ? "bold" : "normal",
                            }}
                            onClick={() => {
                            setSelected({ ...selected, [ct.id]: p.id });
                            setQueries({ ...queries, [ct.id]: p.name });
                            }}
                        >
                            {p.name}
                            {isPriority && " ⭐"}
                        </li>
                        );
                    })}
                    </ul>
                )}

                {selected[ct.id] && (
                    <p>
                    ✔️ Sélectionné :{" "}
                    {
                        partitions.find((p) => p.id === selected[ct.id])?.name
                    }
                    </p>
                )}
                </div>
            );
            })}


        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Créer le programme</button>
        </form>
    );
}
