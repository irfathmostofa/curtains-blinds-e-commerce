import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const store = getStore();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const bookingsWeek = store.bookings.filter((b) => new Date(b.created_at).getTime() > weekAgo).length;
  const newLeads = store.leads.filter((l) => l.status === "new").length;
  const top = store.products.filter((p) => p.is_bestseller);

  const cards = [
    { label: "Open leads", value: newLeads, href: "/admin/leads" },
    { label: "Bookings this week", value: bookingsWeek, href: "/admin/bookings" },
    { label: "Active products", value: store.products.filter((p) => p.is_active).length, href: "/admin/products" },
    { label: "Published posts", value: store.posts.filter((p) => p.published_at).length, href: "/admin/blog" },
  ];

  return (
    <main className="space-y-8">
      <SectionHeading as="h1" title="Dashboard" subtitle="Lead flow, visits and catalogue health." />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="block rounded-2xl border bg-card p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-2 font-serif text-4xl">{c.value}</p>
            </Link>
          </li>
        ))}
      </ul>
      <section>
        <h2 className="font-serif text-2xl">Top products</h2>
        <ul className="mt-4 divide-y rounded-2xl border bg-card">
          {top.map((p) => (
            <li key={p.id} className="flex justify-between px-4 py-3 text-sm">
              <span>{p.name}</span>
              <span>From AED {p.base_price}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
