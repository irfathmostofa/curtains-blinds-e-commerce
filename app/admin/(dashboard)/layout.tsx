import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin/session";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session.loggedIn) redirect("/admin/login");
  return <AdminShell role={session.role}>{children}</AdminShell>;
}
