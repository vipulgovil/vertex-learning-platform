import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Pages to show: first three, an ellipsis, then the last. */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.min(Math.max(1, current - 1), total - 3);
  const pages: (number | "…")[] = [start, start + 1, start + 2];
  if (start + 3 < total) pages.push("…");
  pages.push(total);
  return pages;
}

const item =
  "flex size-8 items-center justify-center rounded-sm text-small transition-colors";

export function Pagination({
  current,
  total,
  hrefFor,
}: {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const arrow = (page: number, label: string, children: React.ReactNode) =>
    page < 1 || page > total ? (
      <span aria-hidden className={`${item} text-neutral-300`}>
        {children}
      </span>
    ) : (
      <Link
        href={hrefFor(page)}
        aria-label={label}
        className={`${item} text-neutral-700 hover:bg-neutral-100`}
      >
        {children}
      </Link>
    );

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2">
      {arrow(current - 1, "Previous page", <ChevronLeft className="size-4" />)}
      {pageList(current, total).map((page, i) =>
        page === "…" ? (
          <span key={`gap-${i}`} className={`${item} text-neutral-700`}>
            …
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            aria-current={page === current ? "page" : undefined}
            className={`${item} ${
              page === current
                ? "border border-primary-500 font-medium text-primary-500"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {page}
          </Link>
        ),
      )}
      {arrow(current + 1, "Next page", <ChevronRight className="size-4" />)}
    </nav>
  );
}
