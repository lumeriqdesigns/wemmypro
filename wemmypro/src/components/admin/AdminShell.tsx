"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/galleries", label: "Galleries" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/clients", label: "Clients" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-[#ddd6cb] bg-[#1a1917] text-[#f7f4ef] md:min-h-screen md:border-b-0 md:border-r">
        <div className="px-5 py-6">
          <Link href="/admin" className="font-serif text-sm tracking-[0.12em] uppercase">
            WemmyPro
          </Link>
          <p className="mt-1 text-[0.65rem] uppercase tracking-widest opacity-40">
            Studio admin
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:overflow-visible">
          {links.map((l) => {
            const active = l.exact
              ? pathname === l.href
              : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "whitespace-nowrap px-3 py-2 text-xs uppercase tracking-widest transition",
                  active ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-5 pb-6 md:block">
          <button
            type="button"
            onClick={signOut}
            className="text-[0.65rem] uppercase tracking-widest text-white/40 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-[#ddd6cb] px-6 py-4 md:hidden">
          <span className="text-xs uppercase tracking-widest text-[#6b6760]">
            Admin
          </span>
          <button
            type="button"
            onClick={signOut}
            className="text-xs uppercase tracking-widest text-[#6b6760]"
          >
            Sign out
          </button>
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
