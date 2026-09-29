import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GalleryCreateForm } from "@/components/admin/GalleryCreateForm";

export default async function GalleriesPage() {
  const supabase = await createClient();
  const { data: galleries } = await supabase
    .from("galleries")
    .select(
      "id, title, slug, is_published, allow_downloads, event_date, client_id, clients(name)"
    )
    .order("created_at", { ascending: false });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl italic">Galleries</h1>
        <p className="mt-1 text-sm text-[#6b6760]">
          Create, publish, and share client galleries
        </p>
      </div>

      <div className="mb-12 max-w-xl card">
        <h2 className="mb-4 font-serif text-xl">New gallery</h2>
        <GalleryCreateForm clients={clients ?? []} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#ddd6cb] text-[0.65rem] uppercase tracking-widest text-[#6b6760]">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Client</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Link</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {(galleries ?? []).map((g: Record<string, unknown>) => {
              const clientsRel = g.clients as { name?: string } | null;
              return (
                <tr key={String(g.id)} className="border-b border-[#ddd6cb]/hover">
                  <td className="py-3 pr-4 font-medium">{String(g.title)}</td>
                  <td className="py-3 pr-4 text-[#6b6760]">
                    {clientsRel?.name ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={g.is_published ? "text-green-800" : "text-[#6b6760]"}>
                      {g.is_published ? "Published" : "Draft"}
                    </span>
                    {g.allow_downloads ? " · DL on" : " · Proofing"}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">/g/{String(g.slug)}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/galleries/${g.id}`}
                      className="text-xs uppercase tracking-widest underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!galleries?.length && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#6b6760]">
                  No galleries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
