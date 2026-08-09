import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="GuideVexa home">
          <span className="brand-mark">G</span>
          <span>GuideVexa</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link href="/tools">Tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link href="/tools" className="button button-small">Explore tools</Link>
      </div>
    </header>
  );
}
