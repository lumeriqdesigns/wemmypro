import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatNgn } from "@/lib/utils";
import type { Invoice, InvoiceLineItem } from "@/types/database";

export default async function PublicInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .eq("id", params.id)
    .single();

  if (!inv || !["sent", "paid", "overdue"].includes(inv.status)) {
    notFound();
  }

  const invoice = inv as Invoice & {
    clients: { name?: string; email?: string } | null;
  };
  const lines = (invoice.line_items || []) as InvoiceLineItem[];

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-lg">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#6b6760]">
          WemmyPro World
        </p>
        <h1 className="mt-2 font-serif text-3xl italic">Invoice</h1>
        <p className="mt-1 font-mono text-xs text-[#6b6760]">
          {invoice.invoice_number}
        </p>

        <div className="mt-8 space-y-1 text-sm">
          <p>
            <span className="text-[#6b6760]">To:</span>{" "}
            {invoice.clients?.name ?? "—"}
          </p>
          {invoice.due_date && (
            <p>
              <span className="text-[#6b6760]">Due:</span> {invoice.due_date}
            </p>
          )}
          <p>
            <span className="text-[#6b6760]">Status:</span>{" "}
            <span className="uppercase tracking-wider">
              {invoice.status === "paid" ? "Paid" : "Awaiting payment"}
            </span>
          </p>
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-[#ddd6cb] text-left text-[0.65rem] uppercase tracking-widest text-[#6b6760]">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-[#ddd6cb]">
                <td className="py-3">{l.description}</td>
                <td className="py-3 text-right">{l.qty}</td>
                <td className="py-3 text-right">
                  {formatNgn(l.qty * l.unit_price, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="py-4 font-medium">
                Total
              </td>
              <td className="py-4 text-right font-serif text-xl">
                {formatNgn(Number(invoice.amount_total), invoice.currency)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-10 text-sm text-[#6b6760]">
          Payment is arranged offline with WemmyPro World. There is no pay
          button on this page — contact the studio to settle this invoice.
        </p>
      </div>
    </main>
  );
}
