"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/types/database";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    setClients((data as Client[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.from("clients").insert({
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      notes: notes.trim() || null,
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setMsg("Client added");
    load();
  }

  async function saveNotes(id: string, value: string) {
    const supabase = createClient();
    await supabase.from("clients").update({ notes: value }).eq("id", id);
  }

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl italic">Clients</h1>
      <p className="mb-8 text-sm text-[#6b6760]">CRM — link to galleries, bookings, invoices</p>

      <form onSubmit={onCreate} className="mb-12 max-w-xl space-y-4 card">
        <h2 className="font-serif text-xl">Add client</h2>
        <div>
          <label className="label">Name</label>
          <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {msg && <p className="text-sm text-[#6b6760]">{msg}</p>}
        <button type="submit" className="btn btn-gold">
          Save client
        </button>
      </form>

      <div className="space-y-4">
        {clients.map((c) => (
          <div key={c.id} className="card">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-medium">{c.name}</h3>
                <p className="text-xs text-[#6b6760]">
                  {[c.email, c.phone].filter(Boolean).join(" · ") || "No contact"}
                </p>
              </div>
              <span className="text-[0.65rem] uppercase tracking-widest text-[#6b6760]">
                {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
            <textarea
              className="input mt-3 min-h-[60px] text-sm"
              defaultValue={c.notes ?? ""}
              placeholder="Notes…"
              onBlur={(e) => saveNotes(c.id, e.target.value)}
            />
          </div>
        ))}
        {!clients.length && (
          <p className="text-sm text-[#6b6760]">No clients yet</p>
        )}
      </div>
    </div>
  );
}
