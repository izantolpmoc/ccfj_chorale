import ProgramForm from "@/components/programs/ProgramForm";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";


export default async function NewProgramPage() {
    const supabase = createClient(cookies());

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <p>Connexion requise</p>;
    }

    const { data: chantTypes } = await supabase
        .from("chant_types")
        .select("id, name")
        .order("id");

    const { data: partitions } = await supabase
        .from("partitions")
        .select("id, name, partition_types ( chant_type_id )")
        .order("name");

    const { data: liturgicalTimes } = await supabase
        .from("liturgical_times")
        .select("id, name, year_cycle")
        .order("id");

    return (
        <ProgramForm
        chantTypes={chantTypes ?? []}
        partitions={partitions ?? []}
        liturgicalTimes={liturgicalTimes ?? []}
        />
    );
}
