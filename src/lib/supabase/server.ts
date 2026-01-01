import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        setAll() {
          // ❌ INTERDIT ici (SSR)
        },
      },
    }
  );
}