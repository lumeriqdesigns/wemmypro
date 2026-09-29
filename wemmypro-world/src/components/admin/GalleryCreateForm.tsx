"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

type ClientOpt = { id: string; name: string };

export function GalleryCreateForm({ clients }: { clients: ClientOpt[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [newClient, setNewClient] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    let cid: string | null = clientId || null;

    if (!cid && newClient.trim()) {
      const { data, error: cErr } = await supabase
        .from("clients")
        .insert({ name: newClient.trim() })
        .select("id")
        .single();
      if (cErr) {
        setLoading(false);
        setError(cErr.message);
        return;
      }
      cid = data.id;
    }

    const base = slugify(title) || "gallery";
    const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;

    const { data, error: gErr } = await supabase
      .from("galleries")
      .insert({
        title: title.trim(),
        client_id: cid,
        event_date: eventDate || null,
        slug,
        is_published: false,
        allow_downloads: false,
        watermark_previews: true,
      })
      .select("id")
      .single();

    setLoading(false);
    if (gErr) {
      setError(gErr.message);
      return;
    }
    router.push(`/admin/galleries/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input
          className="input"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Existing client</label>
        <select
          className="input"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">—</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Or new client name</label>
        <input
          className="input"
          value={newClient}
          onChange={(e) => setNewClient(e.target.value)}
          placeholder="If not selecting above"
        />
      </div>
      <div>
        <label className="label">Event date</label>
        <input
          className="input"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="btn btn-gold" disabled={loading}>
        {loading ? "Creating…" : "Create gallery"}
      </button>
    </form>
  );
}
