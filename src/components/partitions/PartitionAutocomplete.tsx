"use client";

import { useEffect, useState } from "react";

type PartitionResult = {
    id: number;
    name: string;
    partition_types: { chant_type_id: number }[];
};

export default function PartitionAutocomplete({
  chantTypeId,
  onSelect,
}: {
  chantTypeId: number;
  onSelect: (id: number) => void;
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PartitionResult[]>([]);

    useEffect(() => {
        if (query.length < 2) {
        setResults([]);
        return;
        }

        const controller = new AbortController();

        fetch(
        `/api/partitions/search?q=${encodeURIComponent(
            query
        )}&chantTypeId=${chantTypeId}`,
        { signal: controller.signal }
        )
        .then((res) => res.json())
        .then(setResults)
        .catch(() => {});

        return () => controller.abort();
    }, [query, chantTypeId]);

    return (
        <div>
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un chant…"
        />

        <ul>
            {results.map((p) => {
            const isPriority = p.partition_types.some(
                (pt) => pt.chant_type_id === chantTypeId
            );

            return (
                <li key={p.id}>
                <button
                    type="button"
                    onClick={() => onSelect(p.id)}
                >
                    {p.name}
                    {isPriority && " ⭐"}
                </button>
                </li>
            );
            })}
        </ul>
        </div>
    );
}
