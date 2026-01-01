"use client";

import { useRouter } from "next/navigation";

export default function AddPartitionButton() {
    const router = useRouter();

    return (
        <button
        onClick={() => router.push("/partitions/new")}
        style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "white",
            color: "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
        }}
        >
        ➕ Ajouter une partition
        </button>
    );
}
