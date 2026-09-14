import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Star,
  Calendar,
  Tag,
  ArrowRight,
  Clock,
} from "lucide-react";
import { getProjectBySlug, getRelatedProjects, getProjectNav, getProfile } from "@/lib/data";
import { CaseStudy } from "@/components/site/case-study";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/site/reveal";
import { ReadingProgress } from "@/components/site/reading-progress";
import { ShareButton } from "@/components/site/share-button";
import { PageViewTracker } from "@/components/site/page-view-tracker";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const profile = await getProfile();
  return {
    title: `${project.title} — ${profile.name}`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, profile, nav] = await Promise.all([
    getRelatedProjects(project, 3),
    getProfile(),
    getProjectNav(project),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <PageViewTracker path={`/projects/${project.slug}`} slug={project.slug} />
      <ReadingProgress />
      <SiteHeader name={profile.name} socials={profile.socialLinks} />
      <main className="flex-1 pt-28 pb-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* breadcrumb / back */}
          <Reveal>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to all work
            </Link>
          </Reveal>

          {/* header */}
          <Reveal delay={0.05}>
            <header className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/20">
                    <Star className="h-3 w-3 fill-amber-300" />
                    Featured project
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Case study
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-balance">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
                {project.description}
              </p>

              {/* actions */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {project.liveUrl && (
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-600 shadow-lg shadow-violet-600/25">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      Visit live site
                    </a>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1.5 h-4 w-4" />
                      Source code
                    </a>
                  </Button>
                )}
                <ShareButton url={`/projects/${project.slug}`} title={project.title} />
              </div>
            </header>
          </Reveal>

          {/* cover image */}
          {project.coverImage && (
            <Reveal delay={0.1}>
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl glass neon-border">
                <Image
                  src={project.coverImage}
                  alt={`Cover for ${project.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
            </Reveal>
          )}

          {/* meta strip */}
          <Reveal delay={0.15}>
            <div className="mt-8 grid gap-4 rounded-2xl glass p-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  Tech stack
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.techTags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="rounded-md bg-white/5 font-normal text-foreground/75"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Star className="h-3 w-3" />
                  Highlights
                </div>
                <ul className="mt-2.5 space-y-1 text-sm text-foreground/75">
                  <li>· Designed, built & shipped end-to-end</li>
                  <li>· Production traffic with real users</li>
                  <li>· Maintainable, typed codebase</li>
                </ul>
              </div>
            </div>
          </Reveal>

          {/* case study body */}
          <Reveal delay={0.2}>
            <section className="mt-12">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  The <span className="gradient-text">case study</span>
                </h2>
                {project.caseStudy && (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {readingTime(project.caseStudy)} min read
                    <span className="text-white/20">·</span>
                    {wordCount(project.caseStudy)} words
                  </span>
                )}
              </div>
              <div className="mt-4">
                <CaseStudy source={project.caseStudy} />
              </div>
            </section>
          </Reveal>

          {/* gallery (if any extra images beyond cover) */}
          {project.images.length > 1 && (
            <Reveal delay={0.1}>
              <section className="mt-12">
                <h2 className="font-display text-2xl font-bold tracking-tight">Gallery</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/10] overflow-hidden rounded-2xl glass"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </article>

        {/* related projects */}
        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  More <span className="gradient-text">work</span>
                </h2>
                <Link
                  href="/#work"
                  className="group inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl glass transition-all hover:bg-white/[0.06] hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/30 to-violet-600/30" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-semibold">{p.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* prev / next navigation */}
        {(nav.prev || nav.next) && (
          <section className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
            <Reveal>
              <div className="grid gap-3 sm:grid-cols-2">
                {nav.prev ? (
                  <Link
                    href={`/projects/${nav.prev.slug}`}
                    className="group relative overflow-hidden rounded-2xl glass p-5 transition-all hover:bg-white/[0.06] hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <ArrowLeft className="h-3 w-3" />
                      Previous project
                    </div>
                    <div className="mt-2 font-display text-base font-semibold leading-tight text-foreground line-clamp-1">
                      {nav.prev.title}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {nav.prev.description}
                    </div>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
                {nav.next ? (
                  <Link
                    href={`/projects/${nav.next.slug}`}
                    className="group relative overflow-hidden rounded-2xl glass p-5 text-right transition-all hover:bg-white/[0.06] hover:-translate-y-0.5 sm:text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Next project
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <div className="mt-2 font-display text-base font-semibold leading-tight text-foreground line-clamp-1">
                      {nav.next.title}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {nav.next.description}
                    </div>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* CTA */}
        <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-strong p-8 text-center sm:p-12">
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
              </div>
              <h2 className="relative font-display text-2xl font-bold tracking-tight sm:text-3xl text-balance">
                Have a project like this in mind?
              </h2>
              <p className="relative mt-3 text-muted-foreground">
                Let&apos;s talk about how we can build it together.
              </p>
              <div className="relative mt-6">
                <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-600 shadow-lg shadow-violet-600/25">
                  <Link href="/#contact">Start a conversation</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer profile={profile} />
    </div>
  );
}

/** Strip markdown syntax and count words for reading-time estimate. */
function wordCount(source: string): number {
  const text = source
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/[#>*_`~\-]/g, " ") // markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

function readingTime(source: string): number {
  const words = wordCount(source);
  // ~200 wpm reading speed, min 1
  return Math.max(1, Math.round(words / 200));
}
