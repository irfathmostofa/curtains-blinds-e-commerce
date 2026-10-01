import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

const DEMO_COOKIE = "md_admin_session";

export async function isAdminLoggedIn() {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (!supabase) return false;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  }
  return cookies().get(DEMO_COOKIE)?.value === "1";
}
