import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient(cookies());
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/login", req.url));
}
