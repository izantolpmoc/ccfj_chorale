import { createClient } from "@/lib/supabase/server";
import { ProgramWithLiturgicalTime } from "@/types/program-with-liturgical-type";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ProgramsPage() {
    const supabase = createClient(cookies());

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

        <ul>
            {programs?.map((p) => (
            <li key={p.id}>
                <Link href={`/programs/${p.id}`}>
                📅 {p.date} — {p.liturgical_times
                                ? `${p.liturgical_times.name} – Année ${p.liturgical_times.year_cycle}`
                                : "—"}
                </Link>
            </li>
            ))}
        </ul>
        </main>
    );
}
