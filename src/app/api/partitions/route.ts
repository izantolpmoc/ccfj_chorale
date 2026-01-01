import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function sanitizeFilename(filename: string) {
    return filename
        .normalize("NFD")                 // sépare accents
        .replaceAll(/[\u0300-\u036f]/g, "")  // enlève accents
        .replaceAll(/[^a-zA-Z0-9.-]/g, "-")  // remplace caractères spéciaux
        .replaceAll(/-+/g, "-")              // évite ----
        .toLowerCase();
    };

export async function POST(req: Request) {
    const supabase = createClient();

   
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    const pageRaw = formData.get("page");
    const page =
        pageRaw && !isNaN(Number(pageRaw)) ? Number(pageRaw) : null;

        
    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const safeName = sanitizeFilename(file.name);
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
        .from("partitions")
        .upload(filePath, file);

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: partition, error: dbError } = await supabase
        .from("partitions")
        .insert({
        name,
        file_path: filePath,
        added_by: user.id,
        page,
        })
        .select("id")
        .single();

    if (dbError || !partition) {
        return NextResponse.json({ error: dbError?.message }, { status: 500 });
    }

    const typesRaw = formData.get("types");
    const types: number[] = typesRaw ? JSON.parse(typesRaw.toString()) : [];


    if (types.length) {
        const rows = types.map((typeId) => ({
        partition_id: partition.id,
        chant_type_id: typeId,
        }));

        const { error: typesError } = await supabase
        .from("partition_types")
        .insert(rows);

        if (typesError) {
        return NextResponse.json({ error: typesError.message }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true });
}
