import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin/session";
import { getSiteSettings } from "@/lib/data/catalog";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session.loggedIn) redirect("/admin/login");
  const settings = await getSiteSettings();
  return (
    <AdminShell role={session.role} companyName={settings.company_name}>
      {children}
    </AdminShell>
  );
}
