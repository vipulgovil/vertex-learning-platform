import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChartNoAxesColumn,
  CirclePlay,
  Clock,
  File,
  FileText,
  Folder,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Badge } from "./badge";

const shell =
  "flex flex-col rounded-md border border-neutral-200 bg-white p-4 shadow-sm";

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-neutral-700">
      {icon}
      {children}
    </span>
  );
}

const metaIcon = "size-3.5 text-neutral-700";

export function CourseCard({
  title,
  description,
  icon,
  level,
  duration,
  modules,
  href,
}: {
  title: string;
  description: string;
  /** Course mark shown in the dark tile, e.g. a letter or logo. */
  icon: ReactNode;
  level: string;
  duration: string;
  modules: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${shell} gap-6 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary-400`}
    >
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-neutral-900 text-heading-3 font-semibold text-white">
          {icon}
        </span>
        <div>
          <h3 className="text-body font-medium text-neutral-900">{title}</h3>
          <p className="mt-1 text-small text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 whitespace-nowrap">
        <Meta icon={<ChartNoAxesColumn aria-hidden className={metaIcon} />}>
          {level}
        </Meta>
        <Meta icon={<Clock aria-hidden className={metaIcon} />}>
          {duration}
        </Meta>
        <Meta icon={<Folder aria-hidden className={metaIcon} />}>
          {modules} modules
        </Meta>
      </div>
    </Link>
  );
}

/** Large course card used on the home page: icon tile above a serif title. */
export function FeaturedCourseCard({
  title,
  description,
  icon,
  level,
  duration,
  modules,
  href,
}: {
  title: string;
  description: string;
  /** Course mark, e.g. a logo image. */
  icon: ReactNode;
  level: string;
  duration: string;
  modules: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-93 w-full flex-col rounded-lg border border-neutral-200 bg-white px-6 pt-8 pb-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
    >
      <span className="flex size-18 items-center">{icon}</span>
      <h3 className="mt-7 font-display text-[20px] leading-8 text-neutral-900">
        {title}
      </h3>
      <p className="mt-4 text-body leading-6 text-neutral-700">
        {description}
      </p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2 whitespace-nowrap border-t border-neutral-200 pt-6 text-[10px] leading-4">
        <span className="inline-flex items-center gap-1 text-neutral-700">
          <ChartNoAxesColumn aria-hidden className="size-3.5" />
          {level}
        </span>
        <span className="inline-flex items-center gap-1 text-neutral-700">
          <Clock aria-hidden className="size-3.5" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1 text-neutral-700">
          <File aria-hidden className="size-3.5" />
          {modules} modules
        </span>
      </div>
    </Link>
  );
}

export function VideoLessonCard({
  title,
  description,
  lessonLabel,
  clipLength,
  startLabel,
  href,
}: {
  title: string;
  description: string;
  /** e.g. "Lesson 5.1" */
  lessonLabel: string;
  clipLength: string;
  /** e.g. "12:45" */
  startLabel: string;
  href: string;
}) {
  return (
    <article className={`${shell} gap-3`}>
      <div>
        <Badge tone="video">Video</Badge>
      </div>
      <h3 className="text-body font-medium text-neutral-900">{title}</h3>
      <p className="text-small text-neutral-500">{description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <span className="text-small text-neutral-700">
          {lessonLabel} · {clipLength}
        </span>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-small font-medium text-primary-500 hover:text-primary-600"
        >
          <CirclePlay aria-hidden className="size-3.5" />
          Watch from {startLabel}
        </Link>
      </div>
    </article>
  );
}

export function LessonCard({
  title,
  description,
  moduleLabel,
  href,
}: {
  title: string;
  description: string;
  /** e.g. "Module 5" */
  moduleLabel: string;
  href: string;
}) {
  return (
    <article className={`${shell} gap-3`}>
      <div>
        <Badge tone="lesson">Lesson</Badge>
      </div>
      <h3 className="text-body font-medium text-neutral-900">{title}</h3>
      <p className="text-small text-neutral-500">{description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <span className="text-small text-neutral-700">{moduleLabel}</span>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-small font-medium text-primary-500 hover:text-primary-600"
        >
          View lesson
          <SquareArrowOutUpRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function ResourceCard({
  title,
  description,
  fileType,
  fileSize,
  href,
}: {
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  href: string;
}) {
  return (
    <article className={`${shell} gap-6`}>
      <div className="flex gap-3">
        <FileText aria-hidden className="size-6 shrink-0 text-neutral-700" />
        <div>
          <h3 className="text-body font-medium text-neutral-900">{title}</h3>
          <p className="mt-1 text-small text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-small text-neutral-700">
          {fileType} · {fileSize}
        </span>
        <a
          href={href}
          aria-label={`Open ${title}`}
          className="text-primary-500 hover:text-primary-600"
        >
          <SquareArrowOutUpRight aria-hidden className="size-4" />
        </a>
      </div>
    </article>
  );
}
