import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { ChevronDown, Search } from "lucide-react";

const field =
  "h-11 w-full rounded-md border border-neutral-200 bg-white text-body text-neutral-900 placeholder:text-neutral-500 outline-none transition-colors focus:border-primary-400";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${field} px-4 ${className}`} {...props} />;
}

export function SearchInput({
  shortcut = "⌘ K",
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { shortcut?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-neutral-700"
      />
      <input
        type="search"
        className={`${field} pl-11 ${shortcut ? "pr-16" : "pr-4"}`}
        {...props}
      />
      {shortcut && (
        <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-sans text-small font-medium text-neutral-700">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative ${className}`}>
      <select className={`${field} appearance-none pl-4 pr-10`} {...props} />
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-700"
      />
    </div>
  );
}
