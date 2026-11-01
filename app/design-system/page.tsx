import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Accessibility,
  CirclePlay,
  Eye,
  Focus,
  LayoutGrid,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  CourseCard,
  LessonCard,
  ResourceCard,
  VideoLessonCard,
} from "@/components/ui/card";
import { Icon, icons, type IconName } from "@/components/ui/icon";
import { SearchInput, Select } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Navbar } from "@/components/ui/navbar";
import { Pagination } from "@/components/ui/pagination";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Status } from "@/components/ui/status";

export const metadata: Metadata = {
  title: "Design System · Vertex",
};

const primary = [
  ["Primary 500", "bg-primary-500", "#F97316"],
  ["Primary 400", "bg-primary-400", "#FB923C"],
  ["Primary 300", "bg-primary-300", "#FDBA74"],
  ["Primary 200", "bg-primary-200", "#FED7AA"],
  ["Primary 100", "bg-primary-100", "#FFEEE5"],
];

const neutral = [
  ["Neutral 900", "bg-neutral-900", "#0F172A"],
  ["Neutral 700", "bg-neutral-700", "#334155"],
  ["Neutral 500", "bg-neutral-500", "#64748B"],
  ["Neutral 300", "bg-neutral-300", "#CBD5E1"],
  ["Neutral 200", "bg-neutral-200", "#E2E8F0"],
  ["Neutral 100", "bg-neutral-100", "#F1F5F9"],
  ["Neutral 50", "bg-neutral-50 border border-neutral-200", "#FAFAFC"],
  ["White", "bg-white border border-neutral-200", "#FFFFFF"],
];

const typeScale = [
  ["Display 1", "font-display text-[22px] font-bold", "Playfair Display", "48 / 56", "Bold", "Page titles"],
  ["Display 2", "font-display text-lg font-bold", "Playfair Display", "36 / 44", "Bold", "Section titles"],
  ["Heading 1", "text-body-lg font-semibold", "Inter", "28 / 36", "Semi Bold", "Card titles"],
  ["Heading 2", "text-body-lg font-semibold", "Inter", "22 / 30", "Semi Bold", "Sub section"],
  ["Heading 3", "text-body-lg font-medium", "Inter", "18 / 26", "Medium", "Small titles"],
  ["Body Large", "text-body-lg", "Inter", "16 / 24", "Regular", "Body copy"],
  ["Body", "text-body-lg", "Inter", "14 / 20", "Regular", "Supporting text"],
  ["Small", "text-body-lg", "Inter", "12 / 16", "Regular", "Captions, meta"],
];

const spacing = [4, 8, 12, 16, 24, 32, 40, 48, 64];

const radii = [
  ["4px", "(xs)", "rounded-xs"],
  ["8px", "(sm)", "rounded-sm"],
  ["12px", "(md)", "rounded-md"],
  ["16px", "(lg)", "rounded-lg"],
  ["24px", "(xl)", "rounded-xl"],
  ["Full", "(circle)", "rounded-full"],
];

const shadows = [
  ["Sm", "shadow-sm", "0 1px 2px 0", "0.05"],
  ["Md", "shadow-md", "0 4px 12px -2px", "0.08"],
  ["Lg", "shadow-lg", "0 12px 24px -4px", "0.10"],
  ["Xl", "shadow-xl", "0 20px 40px -8px", "0.12"],
];

const principles = [
  [Eye, "Clarity First", "Every element should communicate clearly."],
  [LayoutGrid, "Consistency", "Use components and patterns consistently across the platform."],
  [Focus, "Focus & Calm", "Remove noise and help learners focus on what matters."],
  [Accessibility, "Accessible", "Design with accessibility and inclusivity in mind."],
] as const;

function Panel({
  n,
  title,
  className = "",
  inline = false,
  children,
}: {
  n: string;
  title: string;
  className?: string;
  /** Title sits to the left of the content instead of above it. */
  inline?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-lg border border-neutral-100 bg-white p-6 shadow-sm ${inline ? "lg:flex lg:items-center lg:gap-8" : ""} ${className}`}
    >
      <h2
        className={`flex shrink-0 gap-4 ${inline ? "mb-5 lg:mb-0 lg:w-36" : "mb-5"} text-small font-semibold uppercase tracking-[0.15em] text-neutral-900`}
      >
        <span className="text-primary-500">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-small text-neutral-900">{children}</p>;
}

function Specs({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <Label>{title}</Label>
      <ul className="list-disc space-y-1 pl-5 text-small text-neutral-700 marker:text-neutral-500">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function Swatch({ name, cls, hex }: { name: string; cls: string; hex: string }) {
  return (
    <div className="w-[76px]">
      <div className={`mb-2 h-11 rounded-xs ${cls}`} />
      <p className="text-[11px] leading-4 text-neutral-700">{name}</p>
      <p className="text-[11px] leading-4 text-neutral-700">{hex}</p>
    </div>
  );
}

export default function DesignSystemPage() {
  const iconNames = Object.keys(icons) as IconName[];

  return (
    <main className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-4 p-4 lg:grid-cols-12">
      {/* Header + 01 Colors */}
      <section className="rounded-lg border border-neutral-100 bg-white p-8 shadow-sm lg:col-span-4">
        <Logo size="lg" />
        <h1 className="mt-8 text-display-1">Design System</h1>
        <p className="mt-6 text-body-lg text-neutral-700">
          A unified design language for Vertex learning platform. Clean, modern
          and focused on clarity, consistency and intuitive learning
          experiences.
        </p>
        <p className="mt-10 text-small uppercase tracking-wider text-neutral-700">
          Version 1.0 · May 2025
        </p>
      </section>

      <Panel n="01" title="Colors" className="lg:col-span-8">
        <Label>Primary</Label>
        <div className="flex flex-wrap gap-6">
          {primary.map(([name, cls, hex]) => (
            <Swatch key={name} name={name} cls={cls} hex={hex} />
          ))}
        </div>
        <div className="mt-6">
          <Label>Neutral</Label>
          <div className="flex flex-wrap gap-4">
            {neutral.map(([name, cls, hex]) => (
              <Swatch key={name} name={name} cls={cls} hex={hex} />
            ))}
          </div>
        </div>
      </Panel>

      {/* 02 Typography + 03 Type scale */}
      <Panel n="02" title="Typography" className="lg:col-span-5">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-14">
            <span className="w-24 font-display text-[56px] leading-none">Ag</span>
            <div>
              <p className="font-display text-heading-2 font-normal">
                Playfair Display
              </p>
              <p className="mt-2 text-small text-neutral-700">
                Elegant <span className="text-primary-500">•</span> Readable{" "}
                <span className="text-primary-500">•</span> Timeless
              </p>
            </div>
          </div>
          <div className="flex items-center gap-14">
            <span className="w-24 text-[56px] leading-none">Ag</span>
            <div>
              <p className="text-heading-2 font-normal">Inter</p>
              <p className="mt-2 text-small text-neutral-700">
                Clean <span className="text-primary-500">•</span> Modern{" "}
                <span className="text-primary-500">•</span> Highly legible
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel n="03" title="Type Scale" className="overflow-x-auto lg:col-span-7">
        <table className="w-full min-w-[520px] text-left text-[11px] text-neutral-700">
          <thead>
            <tr>
              {["Style", "Font", "Size / Line Height", "Weight", "Use"].map((h) => (
                <th key={h} className="pb-3 font-normal text-neutral-900">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {typeScale.map(([name, cls, font, size, weight, use]) => (
              <tr key={name}>
                <td className={`py-1 text-neutral-900 ${cls}`}>{name}</td>
                <td>{font}</td>
                <td>{size}</td>
                <td>{weight}</td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* 04 Spacing + 05 Radius & shadows */}
      <Panel n="04" title="Spacing System" className="lg:col-span-6">
        <Label>Base unit: 4px</Label>
        <div className="mt-10 flex flex-wrap items-end gap-x-5 gap-y-6">
          {spacing.map((px) => (
            <div key={px} className="flex flex-col items-center text-small text-neutral-700">
              <div
                className="mb-4 rounded-xs bg-primary-200/60"
                style={{ width: px * 0.6 + 8, height: px * 0.6 + 8 }}
              />
              <span className="text-neutral-900">{px}</span>
              <span className="text-[11px]">({px / 16}rem)</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel n="05" title="Radius & Shadows" className="lg:col-span-6">
        <Label>Radius</Label>
        <div className="flex flex-wrap gap-6">
          {radii.map(([px, name, cls]) => (
            <div key={px} className="text-center text-[11px] text-neutral-700">
              <div className={`mb-2 size-9 border border-neutral-200 bg-white ${cls}`} />
              {px}
              <br />
              {name}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Label>Shadows</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {shadows.map(([name, cls, offsets, alpha]) => (
              <div key={name} className={`rounded-sm bg-white p-3 ${cls}`}>
                <p className="text-body text-neutral-900">{name}</p>
                <p className="mt-2 text-[10px] leading-4 text-neutral-700">
                  {offsets}
                  <br />
                  rgba(15, 23, 42, {alpha})
                </p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* 06 Icons + 07 Buttons + 08 Inputs */}
      <Panel n="06" title="Icons" className="lg:col-span-3">
        <Label>Outline Style</Label>
        <div className="flex flex-wrap justify-between gap-2 text-neutral-900">
          {iconNames.map((name) => (
            <Icon key={name} name={name} className="size-5" />
          ))}
        </div>
        <div className="mt-6">
          <Label>Filled Style</Label>
          <div className="flex flex-wrap justify-between gap-2 text-neutral-900">
            {iconNames.map((name) => (
              <Icon key={name} name={name} filled className="size-5" />
            ))}
          </div>
        </div>
        <Specs
          title="Icon Specs"
          items={[
            "24x24px grid",
            "2px stroke width (outline)",
            "Rounded line caps",
            "Consistent optical balance",
          ]}
        />
      </Panel>

      <Panel n="07" title="Buttons" className="overflow-x-auto lg:col-span-6">
        <div className="grid min-w-[520px] grid-cols-[56px_repeat(4,auto)] items-center justify-between gap-x-3 gap-y-3 text-small text-neutral-900">
          <span />
          <span>Primary</span>
          <span>Secondary</span>
          <span>Tertiary</span>
          <span>Text</span>
          {(["Default", "Hover", "Disabled"] as const).map((state) => {
            const props = {
              size: "md" as const,
              disabled: state === "Disabled",
              "data-state": state === "Hover" ? "hover" : undefined,
            };
            return (
              <div key={state} className="contents">
                <span>{state}</span>
                <Button {...props}>Get Started</Button>
                <Button variant="secondary" {...props}>
                  Explore Courses
                </Button>
                <Button
                  variant="tertiary"
                  icon={<SquareArrowOutUpRight aria-hidden className="size-4" />}
                  {...props}
                >
                  View Lesson
                </Button>
                <Button
                  variant="text"
                  icon={<CirclePlay aria-hidden className="size-4" />}
                  {...props}
                >
                  Watch Video
                </Button>
              </div>
            );
          })}
        </div>
        <Specs
          title="Button Specs"
          items={[
            "Height: 44px (default)",
            "Padding: 0 16px (lg), 0 12px (md)",
            "Radius: 12px",
            "Font: Inter Medium (14–16px)",
          ]}
        />
      </Panel>

      <Panel n="08" title="Inputs" className="lg:col-span-3">
        <Label>Search / Text Input</Label>
        <SearchInput placeholder="Search anything..." aria-label="Search" />
        <div className="mt-6">
          <Label>Select</Label>
          <Select defaultValue="relevant" aria-label="Sort by">
            <option value="relevant">Most Relevant</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </Select>
        </div>
        <Specs
          title="Field Specs"
          items={[
            "Height: 44px",
            "Radius: 12px",
            "Border: 1px solid #E2E8F0",
            "Padding: 0 16px",
            "Focus: Border color #FB923C",
          ]}
        />
      </Panel>

      {/* 09 Badges + 10 Status + 11 Progress */}
      <Panel n="09" title="Badges / Tags" className="lg:col-span-3">
        <div className="grid grid-cols-3 gap-4 text-small text-neutral-900">
          {(
            [
              ["Video", "video"],
              ["Lesson", "lesson"],
              ["Popular", "popular"],
            ] as const
          ).map(([label, tone]) => (
            <div key={tone}>
              <p className="mb-3">{label}</p>
              <Badge tone={tone}>{label}</Badge>
            </div>
          ))}
        </div>
      </Panel>

      <Panel n="10" title="Status / Indicators" className="lg:col-span-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Status kind="in-progress" />
          <Status kind="completed" />
          <Status kind="now-playing" />
          <Status kind="locked" />
        </div>
      </Panel>

      <Panel n="11" title="Progress Bar" className="lg:col-span-5">
        <ProgressBar value={35} />
      </Panel>

      {/* 12 Cards */}
      <Panel n="12" title="Cards" className="lg:col-span-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label>Course Card</Label>
            <CourseCard
              title="Next.js for Production"
              description="Build scalable, high-performance web applications with Next.js."
              icon="N"
              level="Intermediate"
              duration="18h 24m"
              modules={12}
              href="#"
            />
          </div>
          <div className="flex flex-col">
            <Label>Lesson Card (Video)</Label>
            <VideoLessonCard
              title="Data Fetching in Server Components"
              description="Learn how to fetch data on the server using async/await and Next.js best practices."
              lessonLabel="Lesson 5.1"
              clipLength="12:45"
              startLabel="12:45"
              href="#"
            />
          </div>
          <div className="flex flex-col">
            <Label>Lesson Card (Lesson)</Label>
            <LessonCard
              title="Data Fetching & Caching"
              description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
              moduleLabel="Module 5"
              href="#"
            />
          </div>
          <div className="flex flex-col">
            <Label>Resource Card</Label>
            <ResourceCard
              title="Caching and Revalidation Guide"
              description="Deep dive into Next.js caching strategies."
              fileType="PDF"
              fileSize="1.2 MB"
              href="#"
            />
          </div>
        </div>
      </Panel>

      {/* 13 Navigation */}
      <Panel n="13" title="Navigation" className="lg:col-span-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.2fr_1.5fr_1fr]">
          <Navbar
            items={[
              { label: "Courses", href: "/courses" },
              { label: "My Learning", href: "/my-learning" },
            ]}
            activeHref="/courses"
          />
          <div>
            <Label>Breadcrumbs</Label>
            <Breadcrumbs
              items={[
                { label: "All Courses", href: "#" },
                { label: "Next.js for Production", href: "#" },
                { label: "Data Fetching & Caching" },
              ]}
            />
          </div>
          <div>
            <Label>Pagination</Label>
            <Pagination current={1} total={8} hrefFor={(p) => `?page=${p}`} />
          </div>
        </div>
      </Panel>

      {/* 14 Principles */}
      <Panel n="14" title="Principles" inline className="lg:col-span-12">
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(([Glyph, title, text]) => (
            <div key={title} className="flex items-start gap-4">
              <Glyph aria-hidden className="size-8 shrink-0 text-neutral-700" strokeWidth={1.5} />
              <div>
                <p className="text-small font-medium text-neutral-900">{title}</p>
                <p className="mt-1 text-small text-neutral-700">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </main>
  );
}
