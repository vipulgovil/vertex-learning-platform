import { CircleCheck, LoaderCircle, Lock } from "lucide-react";
import { PlayFilled } from "./icon";

const statuses = {
  "in-progress": {
    label: "In Progress",
    icon: LoaderCircle,
    className: "text-primary-500",
  },
  completed: {
    label: "Completed",
    icon: CircleCheck,
    className: "text-success",
  },
  "now-playing": {
    label: "Now Playing",
    icon: PlayFilled,
    className: "text-primary-500",
  },
  locked: { label: "Locked", icon: Lock, className: "text-neutral-700" },
} as const;

export type StatusKind = keyof typeof statuses;

export function Status({ kind }: { kind: StatusKind }) {
  const { label, icon: Icon, className } = statuses[kind];
  return (
    <span className="inline-flex items-center gap-2 text-small text-neutral-900">
      <Icon aria-hidden className={`size-[18px] ${className}`} />
      {label}
    </span>
  );
}
