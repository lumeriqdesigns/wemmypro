"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

const categories = [
  { num: "01", title: "Cinema cameras", desc: "Production bodies for narrative, commercial and music-video work." },
  { num: "02", title: "Mirrorless & stills", desc: "Hybrid and stills cameras for photography, events and content." },
  { num: "03", title: "Lenses", desc: "Primes, zooms and cinema glass — workhorses and specialty optics." },
  { num: "04", title: "Lighting", desc: "LED panels, strobes, modifiers and kits for studio and location." },
  { num: "05", title: "Audio", desc: "Shotguns, lavs, recorders and wireless systems for production sound." },
  { num: "06", title: "Support & accessories", desc: "Gimbals, tripods, cages, monitors, power and support kit." },
];

export default function GearPage() {
  return (
    <MarketingShell>
      <div className="page-hero">
        <div className="wrap">
          <p className="sec-label">Gadgets &amp; gear</p>
          <h1 className="sec-title">
            Equipment we <em>handle</em>
          </h1>
          <p className="sec-desc">
            No cart. No listed prices. Enquire for availability — we respond.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="gear-grid">
            {categories.map((c) => (
              <div key={c.num} className="gear-cell">
                <span className="num">{c.num}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link href="/book" className="btn-text">
                  Make an enquiry
                </Link>
              </div>
            ))}
          </div>
          <div className="gear-note">
            <div>
              <h3>Looking for something specific?</h3>
              <p>
                Name the model or setup. We source and import for creators in
                Nigeria.
              </p>
            </div>
            <Link href="/book" className="btn btn-gold">
              Send a specific enquiry
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
