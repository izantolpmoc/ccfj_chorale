import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } // params est une Promise
) {
    const { id } = await context.params;
    const supabase = createClient();
    const body = await req.json();

    const { error } = await supabase
        .from("partitions")
        .update({
        name: body.name,
        page: body.page,
        audio_link: body.audio_link,
        })
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ success: true });
}
