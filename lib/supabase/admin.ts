import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createWriteClient(): SupabaseClient | ReturnType<typeof createSessionClient> {
  return createAdminClient() || createSessionClient();
}
