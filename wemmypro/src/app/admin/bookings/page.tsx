import { createClient } from "@/lib/supabase/server";
import { BookingStatusSelect } from "@/components/admin/BookingStatusSelect";

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, title, event_date, location, status, notes, created_at, clients(name, email, phone)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl italic">Bookings</h1>
      <p className="mb-8 text-sm text-[#6b6760]">
        Inquiries from the public book form and managed sessions
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#ddd6cb] text-[0.65rem] uppercase tracking-widest text-[#6b6760]">
              <th className="py-3 pr-4">Client</th>
              <th className="py-3 pr-4">Details</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(bookings ?? []).map((b: Record<string, unknown>) => {
              const c = b.clients as {
                name?: string;
                email?: string;
                phone?: string;
              } | null;
              return (
                <tr key={String(b.id)} className="border-b border-[#ddd6cb] align-top">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{c?.name ?? "—"}</div>
                    <div className="text-xs text-[#6b6760]">{c?.email}</div>
                    <div className="text-xs text-[#6b6760]">{c?.phone}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div>{String(b.title || "Session")}</div>
                    <div className="text-xs text-[#6b6760]">{String(b.location || "")}</div>
                    {b.notes ? (
                      <div className="mt-1 max-w-xs text-xs text-[#6b6760]">
                        {String(b.notes)}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-[#6b6760]">
                    {b.event_date ? String(b.event_date) : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <BookingStatusSelect
                      id={String(b.id)}
                      status={String(b.status)}
                    />
                  </td>
                </tr>
              );
            })}
            {!bookings?.length && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#6b6760]">
                  No bookings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
