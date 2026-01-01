import { createClient } from "@/lib/supabase/server";
import { ProgramPartitionRow } from "@/types/program-partition-row";
import { ProgramWithLiturgicalTime } from "@/types/program-with-liturgical-type";

type ProgramPartitionRowWithUrl = ProgramPartitionRow & {
    signedUrl?: string;
};
type Props = {
    params: Promise<{ id: string }>
}

export default async function ProgramPage({ params }: Readonly<Props>) {
    const { id } = await params;
    const supabase = createClient();

    // 1️⃣ Programme
    const { data: program } = await supabase
        .from("programs")
        .select(`
        id,
        date,
        liturgical_times ( name )
        `)
        .eq("id", id)
        .single()
        .overrideTypes<ProgramWithLiturgicalTime>();

    // 2️⃣ Chants du programme
    const { data: rows } = await supabase
        .from("program_partitions")
        .select(`
        id,
        chant_types ( id, name ),
        partitions ( id, name, file_path )
        `)
        .eq("program_id", id)
        .order("chant_type_id")
        .overrideTypes<ProgramPartitionRow[]>();

    const rowsWithUrls: ProgramPartitionRowWithUrl[] = await Promise.all(
        (rows ?? []).map(async (row) => {
            if (!row.partitions?.file_path) {
            return row;
            }

            const { data } = await supabase.storage
            .from("partitions")
            .createSignedUrl(row.partitions.file_path, 60 * 10); // 10 min

            return {
            ...row,
            signedUrl: data?.signedUrl,
            };
        })
    );

    return (
        <main>
        <h1>🎼 Programme du {program?.date}</h1>
        <p>⛪ {program?.liturgical_times?.name}</p>

        <hr />

        {rowsWithUrls?.map((row) => (
            <div key={row.id}>
            <h3>{row.chant_types?.name}</h3>

            {row.partitions ? (
                <a
                href={row.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                >
                📄 {row.partitions.name}
                </a>
            ) : (
                <em>— Aucun chant —</em>
            )}
            </div>
        ))}
        </main>
    );
}
