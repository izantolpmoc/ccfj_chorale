import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function PartitionsPage() {
    const supabase = createClient(cookies());

    // 1️⃣ utilisateur connecté
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <p>Connexion requise pour accéder aux partitions.</p>;
    }

    // 2️⃣ récupérer les partitions
    const { data: partitions, error } = await supabase
        .from("partitions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <p>Erreur lors du chargement des partitions</p>;
    }

    if (!partitions || partitions.length === 0) {
        return <p>Aucune partition pour le moment.</p>;
    }

    // 3️⃣ générer les URLs signées AVANT le JSX
    const partitionsWithUrls = await Promise.all(
        partitions.map(async (p) => {
        const { data, error } = await supabase.storage
            .from("partitions")
            .createSignedUrl(p.file_path, 60 * 10); // 10 minutes

        return {
            ...p,
            signedUrl: error ? null : data?.signedUrl ?? null,
        };
        })
    );

    // 4️⃣ rendu
    return (
        <div>
            <h1>Partitions</h1>

            <ul>
                {partitionsWithUrls.map((p) => (
                <li key={p.id}>
                    <strong>{p.name}</strong>
                    <br />

                    {p.signedUrl ? (
                    <a
                        href={p.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📄 Ouvrir la partition
                    </a>
                    ) : (
                    <span>⛔ Lien indisponible</span>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
}
