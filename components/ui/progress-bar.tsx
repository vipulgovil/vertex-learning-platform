export function ProgressBar({
  value,
  showLabel = true,
}: {
  value: number;
  showLabel?: boolean;
}) {
  const pct = Math.round(Math.min(100, Math.max(0, value)));
  return (
    <div className="flex items-center gap-6">
      <div
        role="progressbar"
        aria-label="Progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100"
      >
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-small text-neutral-700">
          <span className="font-semibold text-neutral-900">{pct}%</span>{" "}
          complete
        </span>
      )}
    </div>
  );
}
