import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import { normalizeRole, type AdminRole } from "@/lib/admin/roles";

const DEMO_COOKIE = "md_admin_session";
const DEMO_ROLE_COOKIE = "md_admin_role";

export type AdminSession = {
  loggedIn: boolean;
  role: AdminRole;
  email: string;
  id: string;
};

function demoRole() {
  return normalizeRole(cookies().get(DEMO_ROLE_COOKIE)?.value || "superadmin");
}

export async function getAdminSession(): Promise<AdminSession> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (!supabase) return { loggedIn: false, role: "editor", email: "", id: "" };
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { loggedIn: false, role: "editor", email: "", id: "" };
    const { data } = await supabase.from("admin_users").select("id, email, role").eq("id", user.id).maybeSingle();
    return {
      loggedIn: true,
      role: data?.role ? normalizeRole(data.role) : "editor",
      email: String(data?.email || user.email || ""),
      id: user.id,
    };
  }
  if (cookies().get(DEMO_COOKIE)?.value !== "1") {
    return { loggedIn: false, role: "editor", email: "", id: "" };
  }
  return {
    loggedIn: true,
    role: demoRole(),
    email: "admin@maisondrape.ae",
    id: "demo",
  };
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const session = await getAdminSession();
  return session.loggedIn ? session.role : null;
}

export async function isAdminLoggedIn() {
  const session = await getAdminSession();
  return session.loggedIn;
}
