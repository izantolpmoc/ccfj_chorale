"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadPartitionForm() {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const router = useRouter();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);

        await fetch("/api/partitions", {
            method: "POST",
            body: formData,
        });

        router.refresh();
    };

    return (
        <form onSubmit={submit}>
        <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

        <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button>Ajouter</button>
        </form>
    );
}
