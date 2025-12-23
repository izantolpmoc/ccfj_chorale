import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient(cookies());

    function sanitizeFilename(filename: string) {
    return filename
        .normalize("NFD")                 // sépare accents
        .replace(/[\u0300-\u036f]/g, "")  // enlève accents
        .replace(/[^a-zA-Z0-9.-]/g, "-")  // remplace caractères spéciaux
        .replace(/-+/g, "-")              // évite ----
        .toLowerCase();
    };

    // 1️⃣ utilisateur connecté
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // 3️⃣ upload Storage
    const safeName = sanitizeFilename(file.name);
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
        .from("partitions")
        .upload(filePath, file);

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 4️⃣ insert DB
    const { error: dbError } = await supabase.from("partitions").insert({
        name,
        file_path: filePath,
        added_by: user.id,
    });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
