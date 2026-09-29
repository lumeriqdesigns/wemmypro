import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = { title: "Services" };

const services = [
  {
    num: "01",
    title: "Photography",
    desc: "Portraits, commercial, fashion, weddings and events. Controlled light, usable files.",
    tags: ["Portraits", "Commercial", "Fashion", "Weddings", "Events"],
  },
  {
    num: "02",
    title: "Cinematography",
    desc: "Music videos, documentaries, brand films and short narrative. Concept through to grade.",
    tags: ["Music video", "Documentary", "Brand film", "Short film"],
  },
  {
    num: "03",
    title: "Consultation",
    desc: "Studio layout, lighting plans, audio chain and workflow for teams upgrading a setup.",
    tags: ["Studio design", "Lighting", "Audio", "Workflow"],
  },
  {
    num: "04",
    title: "Gadgets & gear",
    desc: "Cameras, lenses, lights and audio. We sell and source — enquire for availability and price.",
    tags: ["Sales", "Importation", "Sourcing"],
  },
  {
    num: "05",
    title: "Academy",
    desc: "Practical training in photography and cinematography. Small groups, hands-on.",
    tags: ["Fundamentals", "Lighting", "Cinematography"],
  },
];

export default function ServicesPage() {
  return (
    <MarketingShell>
      <div className="page-hero">
        <div className="wrap">
          <p className="sec-label">Services</p>
          <h1 className="sec-title">
            What we <em>do</em>
          </h1>
          <p className="sec-desc">
            Production, consultation, equipment and training — under one roof in
            Lagos.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="svc-grid">
            {services.map((s) => (
              <div key={s.num} className="svc-card">
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="svc-tags">
                  {s.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/book" className="btn btn-gold">
              Book a consultation
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
