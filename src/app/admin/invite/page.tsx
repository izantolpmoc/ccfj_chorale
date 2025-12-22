"use client";

import { useState } from "react";

export default function InviteUserPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.error) {
        setMessage(data.error);
        } else {
        setMessage("Invitation envoyée ✉️");
        setEmail("");
        }
    }

    return (
        <form onSubmit={handleInvite}>
        <h1>Inviter un choriste</h1>

        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <button type="submit">Envoyer l’invitation</button>

        {message && <p>{message}</p>}
        </form>
    );
}
