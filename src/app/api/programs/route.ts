import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, liturgical_id, selections } = await req.json();

    const { data: program, error } = await supabase
        .from("programs")
        .insert({
        date,
        liturgical_id,
        created_by: user.id,
        })
        .select("id")
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = Object.entries(selections).map(
        ([chantTypeId, partitionId]) => ({
        program_id: program.id,
        chant_type_id: Number(chantTypeId),
        partition_id: partitionId,
        })
    );

    if (rows.length) {
        const { error: linkError } = await supabase
        .from("program_partitions")
        .insert(rows);

        if (linkError) {
        return NextResponse.json(
            { error: linkError.message },
            { status: 500 }
        );
        }
    }

    return NextResponse.json({ success: true });
}
