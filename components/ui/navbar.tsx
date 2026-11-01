import Link from "next/link";
import { Logo } from "./logo";

export type NavItem = { label: string; href: string };

export function Navbar({
  items,
  activeHref,
}: {
  items: NavItem[];
  activeHref?: string;
}) {
  return (
    <nav aria-label="Main" className="flex items-center gap-10">
      <Link href="/" aria-label="Vertex home">
        <Logo />
      </Link>
      <ul className="flex items-center gap-8">
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap text-body font-medium transition-colors ${
                  active
                    ? "text-primary-500"
                    : "text-neutral-900 hover:text-primary-500"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
