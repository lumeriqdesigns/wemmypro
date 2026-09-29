import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [galleries, clients, bookings, unpaid] = await Promise.all([
    supabase.from("galleries").select("id", { count: "exact", head: true }),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .in("status", ["sent", "overdue"]),
  ]);

  const cards = [
    { label: "Galleries", count: galleries.count ?? 0, href: "/admin/galleries" },
    { label: "Clients", count: clients.count ?? 0, href: "/admin/clients" },
    { label: "Bookings", count: bookings.count ?? 0, href: "/admin/bookings" },
    {
      label: "Unpaid invoices",
      count: unpaid.count ?? 0,
      href: "/admin/invoices",
    },
  ];

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl italic">Dashboard</h1>
      <p className="mb-10 text-sm text-[#6b6760]">
        WemmyPro World studio overview
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card hover:border-[#1a1917]">
            <p className="text-[0.65rem] uppercase tracking-widest text-[#6b6760]">
              {c.label}
            </p>
            <p className="mt-2 font-serif text-3xl">{c.count}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/admin/galleries" className="btn btn-gold">
          New gallery
        </Link>
        <Link href="/admin/invoices" className="btn btn-outline">
          New invoice
        </Link>
        <Link href="/admin/clients" className="btn btn-outline">
          Clients
        </Link>
      </div>
    </div>
  );
}
