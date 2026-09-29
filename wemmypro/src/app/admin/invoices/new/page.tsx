"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { nextInvoiceNumber } from "@/lib/utils";
import type { Client, InvoiceLineItem } from "@/types/database";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lines, setLines] = useState<InvoiceLineItem[]>([
    { description: "", qty: 1, unit_price: 0 },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient()
      .from("clients")
      .select("*")
      .order("name")
      .then(({ data }) => setClients((data as Client[]) ?? []));
  }, []);

  const total = lines.reduce((s, l) => s + l.qty * l.unit_price, 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("invoices")
      .insert({
        client_id: clientId || null,
        invoice_number: nextInvoiceNumber(),
        status: "draft",
        line_items: lines,
        amount_total: total,
        currency: "NGN",
        due_date: dueDate || null,
      })
      .select("id")
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/invoices");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-8 font-serif text-3xl italic">New invoice</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="label">Client</label>
          <select
            className="input"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Due date</label>
          <input
            className="input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="label">Line items</label>
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                className="input col-span-6"
                placeholder="Description"
                value={line.description}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = { ...line, description: e.target.value };
                  setLines(next);
                }}
                required
              />
              <input
                className="input col-span-2"
                type="number"
                min={1}
                value={line.qty}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = { ...line, qty: Number(e.target.value) };
                  setLines(next);
                }}
              />
              <input
                className="input col-span-4"
                type="number"
                min={0}
                step="0.01"
                placeholder="Unit price ₦"
                value={line.unit_price || ""}
                onChange={(e) => {
                  const next = [...lines];
                  next[i] = { ...line, unit_price: Number(e.target.value) };
                  setLines(next);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-xs uppercase tracking-widest underline"
            onClick={() =>
              setLines([...lines, { description: "", qty: 1, unit_price: 0 }])
            }
          >
            Add line
          </button>
        </div>

        <p className="font-serif text-xl">
          Total: ₦{total.toLocaleString()}
        </p>

        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn btn-gold" disabled={loading}>
          {loading ? "Saving…" : "Save draft"}
        </button>
      </form>
    </div>
  );
}
