"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/gear", label: "Gear" },
  { href: "/academy", label: "Academy" },
  { href: "/admin", label: "Admin" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function MarketingShell({
  children,
  solidNav = true,
}: {
  children: React.ReactNode;
  solidNav?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (solidNav) {
      document.body.classList.add("inner");
    } else {
      document.body.classList.remove("inner");
    }
    return () => document.body.classList.remove("inner");
  }, [solidNav]);

  useEffect(() => {
    if (solidNav) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [solidNav]);

  const navSolid = solidNav || scrolled;

  return (
    <div className="marketing-root">
      <header className={`nav${navSolid ? " solid" : ""}`} id="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            WemmyPro
          </Link>
          <nav>
            <ul className={`nav-links${open ? " open" : ""}`} id="navLinks">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={pathname === l.href ? "active" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="menu-btn"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      {children}

      <footer id="contact">
        <div className="wrap">
          <div className="ft-grid">
            <div className="ft-brand">
              <Link href="/" className="logo">
                WemmyPro
              </Link>
              <p>
                Lagos studio for photography, cinematography, media gear and
                creative training. Enquiries only.
              </p>
              <div className="ft-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </div>
            </div>
            <div className="ft-col">
              <h4>Navigate</h4>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ft-col">
              <h4>Contact</h4>
              <p>Lagos, Nigeria</p>
              <p>+234 800 000 0000</p>
              <p>hello@wemmypro.world</p>
              <p>Mon–Sat · 9am – 6pm WAT</p>
              <p style={{ marginTop: 14 }}>
                <a
                  className="wa"
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </p>
            </div>
            <div className="ft-col">
              <h4>Studio</h4>
              <p>Galleries, invoices and bookings live in the admin area.</p>
              <p style={{ marginTop: 14 }}>
                <Link href="/login" className="wa">
                  Studio login
                </Link>
              </p>
            </div>
          </div>
          <div className="ft-bottom">
            <span>© {new Date().getFullYear()} WemmyPro World</span>
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
