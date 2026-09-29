import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function HomePage() {
  return (
    <MarketingShell solidNav={false}>
      <section className="hero" id="home">
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&h=1000&fit=crop"
            alt=""
          />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">
            Lagos · Photography · Cinema · Gear · Academy
          </p>
          <h1>
            Capturing moments.
            <br />
            Crafting cinema.
            <br />
            Equipping creators.
          </h1>
          <p className="hero-lead">
            A Lagos studio for photography, cinematography and creative
            training. We also sell and source media equipment — by enquiry, not
            by cart.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <Link href="/book" className="btn btn-gold">
              Book a shoot
            </Link>
            <Link href="/work" className="btn btn-outline-light">
              View work
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head center">
            <p className="sec-label">Studio</p>
            <h2 className="sec-title">
              What we <em>offer</em>
            </h2>
            <p className="sec-desc">
              Production, consultation, equipment and training — under one roof
              in Lagos.
            </p>
          </div>
          <div className="teaser-grid">
            <Link href="/about" className="teaser">
              <h3>About</h3>
              <p>
                The studio behind the work — craft, gear and training under one
                roof.
              </p>
              <span className="btn-text">Our story</span>
            </Link>
            <Link href="/services" className="teaser">
              <h3>Services</h3>
              <p>
                Photography, cinematography, and creative &amp; tech
                consultation.
              </p>
              <span className="btn-text">Explore</span>
            </Link>
            <Link href="/academy" className="teaser">
              <h3>Academy</h3>
              <p>
                Practical training in photography and cinematography — taught on
                set standards.
              </p>
              <span className="btn-text">Learn with us</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="band-warm">
        <div className="wrap">
          <div className="sec-head center">
            <p className="sec-label">Clients</p>
            <h2 className="sec-title">
              Selected <em>feedback</em>
            </h2>
          </div>
          <div className="quote-grid">
            <div className="quote">
              <blockquote>
                “They shot our wedding with a calm, film-like eye. The stills
                and highlight film still get comments months later.”
              </blockquote>
              <cite>
                <strong>Adaobi Okonkwo</strong>
                Wedding · Lagos
              </cite>
            </div>
            <div className="quote">
              <blockquote>
                “Needed a specific cinema lens on a tight timeline. They sourced
                it, kept us updated, and the unit arrived as described.”
              </blockquote>
              <cite>
                <strong>Tunde Kola</strong>
                Filmmaker · Lagos
              </cite>
            </div>
            <div className="quote">
              <blockquote>
                “Studio consultation was practical, not vague. Lighting plan and
                gear list were clear — we saw the difference on the next job.”
              </blockquote>
              <cite>
                <strong>Chioma Mensah</strong>
                Creative director
              </cite>
            </div>
          </div>
          <div className="stats">
            <div>
              <strong>500+</strong>
              <span>Shoots</span>
            </div>
            <div>
              <strong>10+</strong>
              <span>Years</span>
            </div>
            <div>
              <strong>Lagos</strong>
              <span>Based</span>
            </div>
            <div>
              <strong>~24h</strong>
              <span>Reply time</span>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
