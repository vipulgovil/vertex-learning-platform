// Placeholder until the catalog reads courses from Sanity. Shaped like the
// future projection so the page can swap in a server fetch unchanged.
export type HomeCourse = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  level: string;
  duration: string;
  moduleCount: number;
};

export const homeCourses: HomeCourse[] = [
  {
    slug: "nextjs-for-production",
    title: "Next.js for Production",
    summary: "Build scalable, high-performance web applications with Next.js.",
    icon: "/courses/nextjs.svg",
    level: "Intermediate",
    duration: "18h 24m",
    moduleCount: 12,
  },
  {
    slug: "docker-essentials",
    title: "Docker Essentials",
    summary:
      "Containerize applications and streamline your development workflow.",
    icon: "/courses/docker.svg",
    level: "Beginner",
    duration: "10h 12m",
    moduleCount: 8,
  },
  {
    slug: "typescript-deep-dive",
    title: "TypeScript Deep Dive",
    summary: "Go beyond the basics and write safer, more expressive code.",
    icon: "/courses/typescript.svg",
    level: "Intermediate",
    duration: "14h 36m",
    moduleCount: 10,
  },
];
