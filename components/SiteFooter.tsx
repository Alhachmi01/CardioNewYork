import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">G</span><span>GuideVexa</span></div>
          <p className="muted">Useful tools. Clear guides. No unnecessary friction.</p>
        </div>
        <div className="footer-links">
          <Link href="/tools">Tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="shell footer-bottom">© {new Date().getFullYear()} GuideVexa.</div>
    </footer>
  );
}
