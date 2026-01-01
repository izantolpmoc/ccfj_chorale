import { createClient } from "@/lib/supabase/server";
import { ProgramWithLiturgicalTime } from "@/types/program-with-liturgical-type";
import Link from "next/link";
import styles from "./ProgramsPage.module.scss";

export default async function ProgramsPage() {
    const supabase = createClient();

    const { data: programs } = await supabase
        .from("programs")
        .select(`
        id,
        date,
        liturgical_times ( name, year_cycle )
        `)
        .order("date", { ascending: false })
        .overrideTypes<ProgramWithLiturgicalTime[]>();


    return (
        <main>
        <h1>📋 Programmes</h1>

        <Link href="/programs/new" className={styles.addButton}>
        ➕ Nouveau programme
        </Link>

        <ul className={styles.list}>
        {programs?.map((p) => (
            <li key={p.id} className={styles.item}>
            <Link href={`/programs/${p.id}`}>
                <span className={styles.date}>📅 {p.date}</span>
                <span className={styles.liturgical}>
                {p.liturgical_times
                                ? `${p.liturgical_times.name} – Année ${p.liturgical_times.year_cycle}`
                                : "—"}
                </span>
            </Link>
            </li>
        ))}
        </ul>
        </main>
    );
}
