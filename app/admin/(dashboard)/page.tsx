import Link from "next/link";
import { ConstructionBanner } from "@/components/admin/construction-banner";
import { SectionHeading } from "@/components/section-heading";
import {
  getAdminSiteSettings,
  getBlogPosts,
  getBookings,
  getChatLeads,
  getLeads,
  getProducts,
} from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, leads, bookings, posts, chatLeads, settings] = await Promise.all([
    getProducts({ includeInactive: true }),
    getLeads(),
    getBookings(),
    getBlogPosts({ includeDrafts: true }),
    getChatLeads(),
    getAdminSiteSettings(),
  ]);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const bookingsWeek = bookings.filter((b) => new Date(b.created_at).getTime() > weekAgo).length;
  const newLeads = leads.filter((l) => l.status === "new").length + chatLeads.filter((l) => l.status === "new").length;
  const top = products.filter((p) => p.is_bestseller);

  const cards = [
    { label: "Open leads", value: newLeads, href: "/admin/leads" },
    { label: "Bookings this week", value: bookingsWeek, href: "/admin/bookings" },
    { label: "Active products", value: products.filter((p) => p.is_active).length, href: "/admin/products" },
    { label: "Published posts", value: posts.filter((p) => p.published_at).length, href: "/admin/blog" },
  ];

  return (
    <main className="space-y-8">
      {settings.under_construction ? <ConstructionBanner /> : null}
      <SectionHeading as="h1" title="Dashboard" subtitle="Lead flow, visits and catalogue health." />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="block rounded-2xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-2 break-words font-serif text-4xl">{c.value}</p>
            </Link>
          </li>
        ))}
      </ul>
      <section>
        <h2 className="font-serif text-2xl">Top products</h2>
        <ul className="mt-4 divide-y rounded-2xl border bg-card">
          {top.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
              <span className="min-w-0 break-words">{p.name}</span>
              <span className="shrink-0 text-muted-foreground">From AED {p.base_price}</span>
            </li>
          ))}
          {!top.length ? <li className="px-4 py-6 text-sm text-muted-foreground">No bestsellers yet.</li> : null}
        </ul>
      </section>
    </main>
  );
}
