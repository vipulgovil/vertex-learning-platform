export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <path d="M2 4h11l3 6 3-6h11L16 30Z" className="fill-primary-500" />
      <path d="M9 8h4l3 6 3-6h4l-7 14Z" className="fill-white/35" />
    </svg>
  );
}

export function Logo({
  size = "md",
}: {
  size?: "md" | "lg";
}) {
  const lg = size === "lg";
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={lg ? "size-9" : "size-7"} />
      <span
        className={`font-medium tracking-tight text-neutral-900 ${lg ? "text-heading-1" : "text-heading-3"}`}
      >
        Vertex
      </span>
    </span>
  );
}
