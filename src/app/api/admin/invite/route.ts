import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    // 1️⃣ Client user (RLS actif)
    const supabaseUser = createServerClient(cookies());

    const {
        data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Vérifier admin
    const { data: profile } = await supabaseUser
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3️⃣ Admin client (service role)
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
