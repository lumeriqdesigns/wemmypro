"use client";

import { useMemo, useState } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

const workData = [
  {
    t: "Golden hour portraits",
    c: "photography",
    tags: "Portrait · Natural light",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&h=700&fit=crop",
  },
  {
    t: "Brand campaign — Luxe",
    c: "photography",
    tags: "Commercial · Fashion",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&h=900&fit=crop",
  },
  {
    t: "Afrobeats music video",
    c: "cinematography",
    tags: "Music video · Night",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&h=900&fit=crop",
  },
  {
    t: "Lagos documentary short",
    c: "cinematography",
    tags: "Documentary · Street",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&h=700&fit=crop",
  },
  {
    t: "Chidi & Amaka wedding",
    c: "weddings",
    tags: "Wedding · Outdoor",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&h=900&fit=crop",
  },
  {
    t: "Corporate gala",
    c: "weddings",
    tags: "Event · Indoor",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&h=700&fit=crop",
  },
  {
    t: "Editorial fashion",
    c: "photography",
    tags: "Fashion · Studio",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&h=900&fit=crop",
  },
  {
    t: "Short film — Echoes",
    c: "cinematography",
    tags: "Short film · Drama",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&h=700&fit=crop",
  },
];

export default function WorkPage() {
  const [filter, setFilter] = useState("all");
  const [lb, setLb] = useState<{ src: string; cap: string } | null>(null);

  const items = useMemo(
    () =>
      filter === "all" ? workData : workData.filter((w) => w.c === filter),
    [filter]
  );

  return (
    <MarketingShell>
      <div
        className="page-hero"
        style={{ background: "var(--ink)", color: "var(--paper)", border: "none" }}
      >
        <div className="wrap">
          <p className="sec-label" style={{ color: "rgba(247,244,239,0.45)" }}>
            Portfolio
          </p>
          <h1 className="sec-title" style={{ color: "var(--paper)" }}>
            Selected <em>work</em>
          </h1>
          <p className="sec-desc" style={{ color: "rgba(247,244,239,0.55)" }}>
            Stills and motion from client and personal projects.
          </p>
        </div>
      </div>
      <section className="band-ink" style={{ paddingTop: 48 }}>
        <div className="wrap-wide">
          <div className="filters">
            {[
              ["all", "All"],
              ["photography", "Photography"],
              ["cinematography", "Cinematography"],
              ["weddings", "Weddings & events"],
            ].map(([f, label]) => (
              <button
                key={f}
                type="button"
                className={filter === f ? "on" : undefined}
                onClick={() => setFilter(f)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="pf-grid">
            {items.map((w) => (
              <article
                key={w.t}
                className="pf-item"
                onClick={() => setLb({ src: w.img, cap: w.t })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setLb({ src: w.img, cap: w.t });
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.img} alt={w.t} loading="lazy" />
                <div className="pf-cap">
                  <strong>{w.t}</strong>
                  <span>{w.tags}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {lb && (
        <div className="lb open" onClick={() => setLb(null)}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lb-x" onClick={() => setLb(null)}>
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lb.src} alt={lb.cap} />
            <p className="lb-cap">{lb.cap}</p>
          </div>
        </div>
      )}
    </MarketingShell>
  );
}
