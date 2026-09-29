"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function BookPage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const sessionType = String(fd.get("session_type") || "").trim();
    const preferredDate = String(fd.get("preferred_date") || "");
    const location = String(fd.get("location") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const supabase = createClient();
    const { data: client, error: cErr } = await supabase
      .from("clients")
      .insert({ name, email: email || null, phone: phone || null })
      .select("id")
      .single();

    if (cErr) {
      setLoading(false);
      setError(cErr.message);
      return;
    }

    const { error: bErr } = await supabase.from("bookings").insert({
      client_id: client.id,
      title: sessionType || "Session enquiry",
      event_date: preferredDate || null,
      location: location || null,
      status: "inquiry",
      notes: message || null,
    });

    setLoading(false);
    if (bErr) {
      setError(bErr.message);
      return;
    }
    setDone(true);
  }

  return (
    <MarketingShell>
      <div className="page-hero">
        <div className="wrap">
          <p className="sec-label">Contact</p>
          <h1 className="sec-title">
            Book a <em>consultation</em>
          </h1>
          <p className="sec-desc">
            Shoot, gadget enquiry, academy or studio advice. We usually reply
            within a working day.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap" style={{ maxWidth: 600, marginInline: "auto" }}>
          {done ? (
            <div className="card" style={{ textAlign: "center" }}>
              <h2 className="font-serif text-xl" style={{ fontFamily: "Georgia, serif" }}>
                Enquiry sent
              </h2>
              <p className="sec-desc" style={{ margin: "12px auto 24px" }}>
                Thank you. WemmyPro World will be in touch shortly.
              </p>
              <Link href="/" className="btn btn-gold">
                Back home
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="book">
              <div className="book-grid">
                <div className="field">
                  <label>Name</label>
                  <input name="name" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" name="email" required placeholder="you@email.com" />
                </div>
                <div className="field">
                  <label>Phone / WhatsApp</label>
                  <input name="phone" placeholder="+234 …" />
                </div>
                <div className="field">
                  <label>Service</label>
                  <select name="session_type" required>
                    <option value="">Select…</option>
                    <option>Photography / cinematography shoot</option>
                    <option>Gadget enquiry</option>
                    <option>Studio / creative consultation</option>
                    <option>Academy enquiry</option>
                    <option>Custom project</option>
                  </select>
                </div>
                <div className="field">
                  <label>Preferred date</label>
                  <input type="date" name="preferred_date" />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input name="location" placeholder="Lagos / studio / other" />
                </div>
                <div className="field full">
                  <label>Project notes</label>
                  <textarea name="message" placeholder="Brief, requirements…" />
                </div>
              </div>
              {error && <p style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</p>}
              <button type="submit" className="btn btn-gold" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
