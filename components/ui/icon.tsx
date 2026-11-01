import type { SVGProps } from "react";
import {
  Bell,
  Bookmark,
  ChartNoAxesColumn,
  ChevronRight,
  CirclePlay,
  Clock,
  FileText,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";

// Specs: 24×24 grid, 2px stroke, rounded line caps (Lucide defaults).
export const icons = {
  bell: Bell,
  search: Search,
  play: CirclePlay,
  file: FileText,
  bookmark: Bookmark,
  chart: ChartNoAxesColumn,
  clock: Clock,
  user: User,
  "chevron-right": ChevronRight,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

// Filled style: fill the outer shape, draw the inner detail in white.
const filledClasses: Partial<Record<IconName, string>> = {
  clock: "[&>circle]:fill-current [&>path]:stroke-white",
  file: "[&>path:first-child]:fill-current [&>path:not(:first-child)]:stroke-white",
};

/** Filled play: Lucide paints the triangle before the circle, so a filled circle would hide it. */
export function PlayFilled({
  className = "size-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...props}>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="M9.5 8.6a.8.8 0 0 1 1.2-.7l5 3.4a.8.8 0 0 1 0 1.4l-5 3.4a.8.8 0 0 1-1.2-.7Z"
        fill="white"
      />
    </svg>
  );
}

export function Icon({
  name,
  filled = false,
  className = "size-6",
}: {
  name: IconName;
  filled?: boolean;
  className?: string;
}) {
  const Glyph = icons[name];
  if (!filled || name === "search" || name === "chevron-right") {
    return (
      <Glyph aria-hidden className={className} strokeWidth={filled ? 2.5 : 2} />
    );
  }
  if (name === "play") return <PlayFilled className={className} />;
  const filledClass = filledClasses[name] ?? "fill-current";
  return <Glyph aria-hidden className={`${className} ${filledClass}`} />;
}
