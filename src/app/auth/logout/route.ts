import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
    const supabase = await createRouteClient(); // ✅ await ici aussi

    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/login", req.url), {
        status: 302,
    });
}
