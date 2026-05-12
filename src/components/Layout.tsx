import Link from "next/link";
import { ReactNode } from "react";
import { site } from "../content/site";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/bio", label: "Bio" },
  { href: "/publications", label: "Publications" },
  { href: "/research", label: "Research" },
  { href: "/teaching", label: "Teaching" },
  { href: "/cv", label: "CV" }
];

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label={`${site.name} home`}>
          <span>{site.name}</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>{site.name}</span>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </footer>
    </div>
  );
}
