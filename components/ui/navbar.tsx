import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./logo";

export type NavItem = { label: string; href: string };

export function Navbar({
  items,
  activeHref,
  actions,
  size = "md",
  className = "",
}: {
  items: NavItem[];
  activeHref?: string;
  /** Right-aligned controls, e.g. notifications and avatar. */
  actions?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <nav
      aria-label="Main"
      className={`flex items-center ${size === "lg" ? "gap-15" : "gap-10"} ${className}`}
    >
      <Link href="/" aria-label="Vertex home">
        <Logo size={size} />
      </Link>
      <ul
        className={`hidden items-center sm:flex ${size === "lg" ? "gap-10.5" : "gap-8"}`}
      >
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap transition-colors ${
                  size === "lg" ? "text-body-lg" : "text-body font-medium"
                } ${
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
      {actions && (
        <div className="ml-auto flex items-center gap-6">{actions}</div>
      )}
    </nav>
  );
}
