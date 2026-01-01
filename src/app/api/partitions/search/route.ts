import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const supabase = createClient(cookies());
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") ?? "";
    const chantTypeId = searchParams.get("chantTypeId"); // ex: communion

    if (!q) {
        return NextResponse.json([]);
    }

    const { data, error } = await supabase
        .from("partitions")
        .select(`
        id,
        name,
        partition_types ( chant_type_id )
        `)
        .ilike("name", `%${q}%`)
        .limit(20);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ⭐ Priorisation par type
    const sorted = [...(data ?? [])].sort((a, b) => {
        const aMatch = a.partition_types?.some(
        (pt) => pt.chant_type_id === Number(chantTypeId)
        );
        const bMatch = b.partition_types?.some(
        (pt) => pt.chant_type_id === Number(chantTypeId)
        );

        return Number(bMatch) - Number(aMatch);
    });

    return NextResponse.json(sorted);
}
