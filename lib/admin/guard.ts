import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { canAccessPath, type AdminRole } from "@/lib/admin/roles";

export async function requireAdminPage(pathname: string, entity?: string) {
  const session = await getAdminSession();
  if (!session.loggedIn) redirect("/admin/login");
  if (!canAccessPath(session.role, pathname)) notFound();
  return session;
}

export async function requireAdminRole(): Promise<AdminRole> {
  const session = await getAdminSession();
  if (!session.loggedIn) redirect("/admin/login");
  return session.role;
}
