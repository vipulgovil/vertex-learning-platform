import type { ReactNode } from "react";

const tones = {
  video: "bg-primary-100 text-primary-500",
  lesson: "bg-lesson-bg text-lesson",
  popular: "bg-primary-100 text-popular",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-2 py-1 text-[10px] font-semibold uppercase leading-3 tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
