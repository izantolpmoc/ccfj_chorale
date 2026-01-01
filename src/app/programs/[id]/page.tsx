import styles from "./ProgramPage.module.scss";
import { createClient } from "@/lib/supabase/server";
import { ProgramPartitionRow } from "@/types/program-partition-row";
import { ProgramWithLiturgicalTime } from "@/types/program-with-liturgical-type";

type ProgramPartitionRowWithUrl = ProgramPartitionRow & {
    signedUrl?: string;
};

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ProgramPage({ params }: Readonly<Props>) {
    const { id } = await params;
    const supabase = createClient();

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

    const { data: rows } = await supabase
        .from("program_partitions")
        .select(`
        id,
        chant_types ( id, name ),
        partitions ( id, name, file_path, page )
        `)
        .eq("program_id", id)
        .order("chant_type_id")
        .overrideTypes<ProgramPartitionRow[]>();

    const rowsWithUrls: ProgramPartitionRowWithUrl[] = await Promise.all(
        (rows ?? []).map(async (row) => {
        if (!row.partitions?.file_path) return row;

        const { data } = await supabase.storage
            .from("partitions")
            .createSignedUrl(row.partitions.file_path, 60 * 10);

        return {
            ...row,
            signedUrl: data?.signedUrl,
        };
        })
    );

    return (
        <main className={styles.page}>
        <header className={styles.header}>
            <h1>🎼 Programme du {program?.date}</h1>
            {program?.liturgical_times?.name && (
            <p className={styles.liturgical}>
                ⛪ {program.liturgical_times.name}
            </p>
            )}
        </header>

        <section className={styles.list}>
            {rowsWithUrls.map((row) => (
            <div key={row.id} className={styles.item}>
                <h3 className={styles.type}>
                {row.chant_types?.name}
                </h3>

                {row.partitions ? (
                <a
                    href={row.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    📄 {row.partitions.name} {row.partitions.page? `(P.${row.partitions.page})` : null}
                </a>
                ) : (
                <span className={styles.empty}>
                    — Aucun chant —
                </span>
                )}
            </div>
            ))}
        </section>
        </main>
    );
}
