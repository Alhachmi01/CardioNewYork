import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header site-header-polished">
      <div className="shell header-inner header-inner-polished">
        <Link href="/" className="brand brand-polished" aria-label="GuideVexa home">
          <span className="brand-mark brand-mark-polished" aria-hidden="true"><span>V</span></span>
          <span className="brand-name">GuideVexa</span>
        </Link>
        <nav className="nav nav-polished" aria-label="Primary navigation">
          <Link href="/tools">Tools</Link>
          <Link href="/guides">Guides</Link>
          <Link className="nav-about" href="/about">About</Link>
        </nav>
        <Link href="/tools" className="button button-small header-cta">Find a tool</Link>
      </div>
    </header>
  );
}
