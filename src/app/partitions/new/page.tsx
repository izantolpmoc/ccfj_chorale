import UploadPartitionForm from "@/components/partitions/UploadPartitionForm";
import { createClient } from "@/lib/supabase/server";
import { ChantType } from "@/types/chant-type";
import { cookies } from "next/headers";

export default async function NewPartitionPage() {

    const supabase = createClient(cookies());

    const { data: chantTypes } = await supabase
        .from("chant_types")
        .select("id, name")
        .order("name") as { data: ChantType[] | null };

    return (
        <>
            <h1>Ajouter une partition</h1>
            <UploadPartitionForm chantTypes={chantTypes || []} />
        </>
    );
}
