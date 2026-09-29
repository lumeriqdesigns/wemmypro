import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <MarketingShell>
      <div className="page-hero">
        <div className="wrap">
          <p className="sec-label">Contact</p>
          <h1 className="sec-title">
            Get in <em>touch</em>
          </h1>
          <p className="sec-desc">
            Lagos-based. Enquiries for shoots, gear and consultation.
          </p>
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="svc-grid" style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="svc-card">
              <div className="num">Studio</div>
              <h3>Location</h3>
              <p>
                Lagos, Nigeria
                <br />
                Mon–Sat · 9am – 6pm WAT
              </p>
            </div>
            <div className="svc-card">
              <div className="num">Reach us</div>
              <h3>Details</h3>
              <p>
                +234 800 000 0000
                <br />
                hello@wemmypro.world
              </p>
              <p style={{ marginTop: 16 }}>
                <a
                  className="btn btn-gold"
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/book" className="btn btn-gold">
              Book a consultation
            </Link>
            <span style={{ display: "inline-block", width: 12 }} />
            <Link href="/login" className="btn btn-outline">
              Studio login
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
