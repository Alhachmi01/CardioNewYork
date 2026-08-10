"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isLandingPage = pathname.startsWith("/go/");

  if (isLandingPage) {
    return (
      <footer className="site-footer landing-footer">
        <div className="shell landing-footer-inner">
          <span>© {new Date().getFullYear()} GuideVexa.</span>
          <nav aria-label="Landing page legal links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="brand footer-brand brand-polished"><span className="brand-mark brand-mark-polished" aria-hidden="true"><span>V</span></span><span className="brand-name">GuideVexa</span></div>
          <p className="muted">Useful tools. Clear guides. No unnecessary friction.</p>
        </div>
        <div className="footer-links">
          <Link href="/tools">Tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="shell footer-bottom">© {new Date().getFullYear()} GuideVexa.</div>
    </footer>
  );
}
