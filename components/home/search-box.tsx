"use client";

import { useEffect, useRef } from "react";
import Form from "next/form";
import { Search } from "lucide-react";

export function SearchBox() {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Form action="/search" role="search" className="relative w-full">
      <label htmlFor="home-search" className="sr-only">
        Search your learning
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-6 top-1/2 size-6.5 -translate-y-1/2 text-neutral-700"
        strokeWidth={1.75}
      />
      <input
        ref={input}
        id="home-search"
        name="q"
        type="search"
        required
        autoComplete="off"
        placeholder="Ask anything about your learning..."
        className="h-16 w-full rounded-md border border-neutral-200 bg-white pl-15 pr-6 text-body-lg text-neutral-900 shadow-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-primary-400 sm:h-21 sm:pl-17.5 sm:pr-28 sm:text-[20px]"
      />
      <kbd className="pointer-events-none absolute right-5.5 top-1/2 hidden h-10.5 -translate-y-1/2 items-center rounded-sm border border-neutral-200 bg-white px-3.5 font-sans text-body-lg text-neutral-900 sm:flex">
        ⌘ K
      </kbd>
    </Form>
  );
}
