import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <MarketingShell>
      <div className="page-hero">
        <div className="wrap">
          <p className="sec-label">About</p>
          <h1 className="sec-title">
            The studio <em>behind</em> the work
          </h1>
          <p className="sec-desc">
            Lagos-based. Built around the craft of image-making, and the tools
            that make it possible.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="prose">
            <p className="lead">
              WemmyPro World is a creative studio in Lagos working across
              photography, cinematography, media gear, and practical training.
            </p>
            <p>
              We started from a simple idea: good images need both skill and the
              right equipment. Too often those sit in different places — a
              shooter who cannot source kit, or a shop that does not understand
              production. We hold both under one roof.
            </p>
            <p>
              Our work covers stills and motion for clients who want calm
              direction and usable files. Alongside production, we sell and
              source cameras, lenses, lighting and audio for creators across
              Nigeria. Enquiries only; no online cart.
            </p>
            <p>
              Through the academy we pass on what we use on set. The same
              standards we apply on jobs shape how we teach.
            </p>
          </div>
        </div>
      </section>
      <section className="band-warm">
        <div className="wrap">
          <div className="sec-head center">
            <p className="sec-label">How we work</p>
            <h2 className="sec-title">
              What we <em>value</em>
            </h2>
          </div>
          <div className="values-grid">
            <div className="svc-card">
              <div className="num">01</div>
              <h3>Craft first</h3>
              <p>Clear briefs, controlled light, files you can actually use.</p>
            </div>
            <div className="svc-card">
              <div className="num">02</div>
              <h3>Honest gear</h3>
              <p>
                Equipment we would use ourselves. Availability and pricing on
                enquiry.
              </p>
            </div>
            <div className="svc-card">
              <div className="num">03</div>
              <h3>Practical teaching</h3>
              <p>Academy sessions mirror real jobs — not only theory.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap" style={{ textAlign: "center" }}>
          <Link href="/book" className="btn btn-gold">
            Book a consultation
          </Link>
          <span style={{ display: "inline-block", width: 12 }} />
          <Link href="/academy" className="btn btn-outline">
            Explore the academy
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
