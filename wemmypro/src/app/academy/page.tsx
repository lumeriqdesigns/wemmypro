import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = { title: "Academy" };

const courses = [
  {
    title: "Photography fundamentals",
    desc: "Exposure, light, composition and a practical workflow from capture to delivery.",
    meta: ["In person · Lagos", "Beginner – intermediate"],
  },
  {
    title: "Lighting for stills & video",
    desc: "Natural light, continuous LED and strobe setups. Shaping faces, products and small sets.",
    meta: ["In person · Lagos", "Intermediate"],
  },
  {
    title: "Cinematography basics",
    desc: "Camera movement, lenses, exposure for motion and a simple production pipeline.",
    meta: ["In person · Lagos", "Beginner – intermediate"],
  },
  {
    title: "Creator workshop",
    desc: "Hybrid photo/video, sound basics, and gear choices that fit a real budget.",
    meta: ["In person · Lagos", "All levels"],
  },
];

export default function AcademyPage() {
  return (
    <MarketingShell>
      <div className="page-hero">
        <div className="wrap">
          <p className="sec-label">Academy</p>
          <h1 className="sec-title">
            Learn the <em>craft</em>
          </h1>
          <p className="sec-desc">
            Practical training in photography and cinematography — taught the way
            we work on set.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="prose">
            <p className="lead">
              WemmyPro Academy is for people who want usable skill, not only
              theory. Sessions mirror real jobs.
            </p>
            <p>
              Classes run in Lagos; cohort dates and fees are shared on enquiry.
            </p>
          </div>
        </div>
      </section>
      <section className="band-warm">
        <div className="wrap">
          <div className="sec-head center">
            <p className="sec-label">Programmes</p>
            <h2 className="sec-title">
              What we <em>teach</em>
            </h2>
          </div>
          <div className="course-list">
            {courses.map((c) => (
              <div key={c.title} className="course-row">
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
                <div className="course-meta">
                  {c.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="band-ink">
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="sec-label">Enrol</p>
          <h2 className="sec-title" style={{ color: "var(--paper)", marginBottom: 12 }}>
            Next <em>intake</em>
          </h2>
          <p className="sec-desc" style={{ margin: "0 auto 28px" }}>
            Tell us your level and which track interests you.
          </p>
          <Link href="/book" className="btn btn-gold">
            Enquire about the academy
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
