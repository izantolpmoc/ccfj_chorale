import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies()
          return cookieStore.getAll()
        },
        setAll() {
          // ❌ interdit ici
        },
      },
    }
  )
}
export const createClient = createSupabaseServerClient
