"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isLandingPage = pathname.startsWith("/go/");

  return (
    <header className={`site-header site-header-polished${isLandingPage ? " landing-header" : ""}`}>
      <div className="shell header-inner header-inner-polished">
        <Link href="/" className="brand brand-polished" aria-label="GuideVexa home">
          <span className="brand-mark brand-mark-polished" aria-hidden="true"><span>V</span></span>
          <span className="brand-name">GuideVexa</span>
        </Link>

        {isLandingPage ? (
          <a href="#get-pack" className="button button-small landing-header-cta">Get travel pack</a>
        ) : (
          <>
            <nav className="nav nav-polished" aria-label="Primary navigation">
              <Link href="/tools">Tools</Link>
              <Link href="/guides">Guides</Link>
              <Link className="nav-about" href="/about">About</Link>
            </nav>
            <Link href="/tools" className="button button-small header-cta">Find a tool</Link>
          </>
        )}
      </div>
    </header>
  );
}
