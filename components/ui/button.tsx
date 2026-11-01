import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex h-11 shrink-0 items-center whitespace-nowrap justify-center gap-2 rounded-md text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:cursor-not-allowed";

// `data-[state=hover]` lets the design-system page show the hover state statically.
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 data-[state=hover]:bg-primary-600 disabled:bg-primary-200 disabled:hover:bg-primary-200",
  secondary:
    "border border-primary-500 bg-white text-primary-500 hover:bg-primary-100 data-[state=hover]:bg-primary-100 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-white",
  tertiary:
    "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 data-[state=hover]:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-white",
  text: "text-primary-500 hover:text-primary-600 data-[state=hover]:text-primary-600 disabled:text-primary-300 disabled:hover:text-primary-300",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-3",
  lg: "px-4",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "lg",
) {
  const padding = variant === "text" ? "px-0" : sizes[size];
  return `${base} ${variants[variant]} ${padding}`;
}

export function Button({
  variant = "primary",
  size = "lg",
  icon,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing icon, e.g. external link or play. */
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${buttonClasses(variant, size)} ${className}`}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}
