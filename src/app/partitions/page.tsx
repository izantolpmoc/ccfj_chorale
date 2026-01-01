import { createClient } from "@/lib/supabase/server";
import PartitionsList from "@/components/partitions/PartitionsList";

export default async function PartitionsPage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <p>Connexion requise pour accéder aux partitions.</p>;
    }

    const { data: partitions } = await supabase
        .from("partitions")
        .select("*")
        .order("created_at", { ascending: false });

    if (!partitions || partitions.length === 0) {
        return <p>Aucune partition pour le moment.</p>;
    }

    const partitionsWithUrls = await Promise.all(
        partitions.map(async (p) => {
        const { data } = await supabase.storage
            .from("partitions")
            .createSignedUrl(p.file_path, 60 * 10);

        return {
            ...p,
            signedUrl: data?.signedUrl ?? null,
        };
        })
    );

    return <PartitionsList partitions={partitionsWithUrls} />;
}
