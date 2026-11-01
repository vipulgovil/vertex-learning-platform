import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, Star } from "lucide-react";
import { BottomBars } from "@/components/home/bottom-bars";
import { SearchBox } from "@/components/home/search-box";
import { AccountMenu } from "@/components/ui/account-menu";
import { FeaturedCourseCard } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { homeCourses } from "@/lib/home-courses";

const navItems = [
  { label: "Courses", href: "/courses" },
  { label: "My Learning", href: "/my-learning" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-cream sm:bg-[repeating-linear-gradient(135deg,var(--color-hatch)_0_1px,transparent_1px_8px)] sm:px-7.5">
      <div className="flex w-full max-w-360 flex-col bg-cream sm:border-x sm:border-neutral-200/70">
        <header className="border-b border-neutral-200/70 px-4 py-5 sm:pl-10 sm:pr-8 xl:px-16">
          <Navbar
            size="lg"
            items={navItems}
            actions={
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  className={`rounded-sm text-neutral-700 transition-colors hover:text-primary-500 ${focusRing}`}
                >
                  <Bell aria-hidden className="size-6" strokeWidth={1.75} />
                </button>
                <AccountMenu />
              </>
            }
          />
        </header>

        <section className="flex flex-col items-center border-b border-neutral-200/70 px-4 pt-17 pb-13.5 text-center sm:px-8">
          <p className="rounded-sm border border-primary-200 bg-primary-100/60 px-3.5 py-2.5 text-[11px] font-semibold uppercase leading-4 tracking-[0.2em] text-primary-600">
            Intelligent Learning
          </p>
          <h1 className="mt-8 font-display text-[34px] font-medium leading-11 tracking-tight text-neutral-900 sm:text-[52px] sm:leading-16 lg:text-[60px] lg:leading-18">
            Search your learning
            <br />
            in plain English.
          </h1>
          <p className="mt-7 max-w-117 text-body-lg text-neutral-700 sm:text-[19px] sm:leading-8.5">
            Vertex understands what you want to learn and finds the exact
            lessons across all your courses.
          </p>
          <Link
            href="/courses"
            className={`mt-10 inline-flex h-15 items-center gap-5 rounded-sm bg-primary-500 px-6 text-[18px] text-white shadow-[0_8px_20px_-6px_rgba(249,115,22,0.55)] transition-colors hover:bg-primary-600 ${focusRing}`}
          >
            Explore Courses
            <ArrowRight aria-hidden className="size-5.5" strokeWidth={1.75} />
          </Link>
          <div className="mt-11 w-full max-w-186.5">
            <SearchBox />
          </div>
        </section>

        <section
          aria-labelledby="all-courses"
          className="px-4 pt-14 sm:px-13 xl:px-18"
        >
          <div className="flex items-center justify-between gap-4">
            <h2
              id="all-courses"
              className="font-display text-[28px] leading-9 text-neutral-900"
            >
              All Courses
            </h2>
            <Link
              href="/courses"
              className={`inline-flex items-center gap-2.5 rounded-xs text-[15px] text-primary-500 transition-colors hover:text-primary-600 ${focusRing}`}
            >
              View all courses
              <ArrowRight aria-hidden className="size-4.5" strokeWidth={1.75} />
            </Link>
          </div>
          <ul className="mt-6.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeCourses.map((course) => (
              <li key={course.slug} className="flex">
                <FeaturedCourseCard
                  href={`/courses/${course.slug}`}
                  title={course.title}
                  description={course.summary}
                  icon={
                    <Image
                      src={course.icon}
                      alt=""
                      width={72}
                      height={72}
                      unoptimized
                    />
                  }
                  level={course.level}
                  duration={course.duration}
                  modules={course.moduleCount}
                />
              </li>
            ))}
          </ul>

          <div className="mt-17 flex items-center gap-8 sm:gap-10">
            <span className="h-px flex-1 bg-neutral-200" />
            <p className="flex items-center gap-3 text-center text-body-lg text-neutral-700 sm:text-[17px]">
              <Star
                aria-hidden
                className="size-5.5 shrink-0 text-primary-500"
                strokeWidth={1.5}
              />
              New courses and lessons added every week.
            </p>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>
        </section>

        <div className="mt-10 sm:mt-auto sm:pt-10">
          <BottomBars />
        </div>
      </div>
    </div>
  );
}
