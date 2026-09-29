import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatNgn } from "@/lib/utils";
import { InvoiceActions } from "@/components/admin/InvoiceActions";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, status, amount_total, currency, due_date, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl italic">Invoices</h1>
          <p className="mt-1 text-sm text-[#6b6760]">
            Manual invoices — mark sent and paid offline (no online payment)
          </p>
        </div>
        <Link href="/admin/invoices/new" className="btn btn-gold">
          New invoice
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#ddd6cb] text-[0.65rem] uppercase tracking-widest text-[#6b6760]">
              <th className="py-3 pr-4">Number</th>
              <th className="py-3 pr-4">Client</th>
              <th className="py-3 pr-4">Amount</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Due</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {(invoices ?? []).map((inv: Record<string, unknown>) => {
              const c = inv.clients as { name?: string } | null;
              return (
                <tr key={String(inv.id)} className="border-b border-[#ddd6cb]">
                  <td className="py-3 pr-4 font-mono text-xs">
                    {String(inv.invoice_number)}
                  </td>
                  <td className="py-3 pr-4">{c?.name ?? "—"}</td>
                  <td className="py-3 pr-4">
                    {formatNgn(Number(inv.amount_total), String(inv.currency || "NGN"))}
                  </td>
                  <td className="py-3 pr-4 uppercase tracking-wider text-xs">
                    {String(inv.status)}
                  </td>
                  <td className="py-3 pr-4 text-[#6b6760]">
                    {inv.due_date ? String(inv.due_date) : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <InvoiceActions
                      id={String(inv.id)}
                      status={String(inv.status)}
                    />
                  </td>
                </tr>
              );
            })}
            {!invoices?.length && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#6b6760]">
                  No invoices yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
