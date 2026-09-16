import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getEducation } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { EducationSection } from "@/components/site/education";
import { GraduationCap, Award, BookOpen, ArrowRight, Library, Sparkles } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Education & Qualifications | ${profile.name} — ${profile.title}`,
    description: "Academic degrees, computer science background, qualifications, and honors.",
  };
}

export default async function EducationPage() {
  const [profile, education] = await Promise.all([getProfile(), getEducation()]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Education</span>
          </div>

          {/* Header section */}
          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              <span className="h-px w-8 bg-blue-400/60" />
              Academic Credentials
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Academic Foundation & <span className="gradient-text">Degrees</span>.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Formal qualifications in computer science, software engineering principles, and data structures providing a solid grounding for commercial software engineering.
            </p>
          </div>

          {/* Highlight badges */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-blue-400" />
                Degrees
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {education.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">University credentials earned</p>
            </div>

            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Library className="h-4 w-4 text-violet-400" />
                Specialization
              </div>
              <div className="mt-2 font-display text-xl font-bold text-foreground">
                Computer Science
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Software Engineering & Systems</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Award className="h-4 w-4 text-amber-400" />
                Academic Honors
              </div>
              <div className="mt-2 font-display text-xl font-bold text-amber-300">
                High Distinction
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Honors & Capstone Recognition</p>
            </div>
          </div>

          {/* Education List */}
          <div className="mt-14">
            <EducationSection items={education} />
          </div>

          {/* Related Links / CTA */}
          <div className="mt-20 overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center relative">
            <div className="relative max-w-xl mx-auto">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Explore Career Journey
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                See how theoretical knowledge transforms into commercial applications and leadership on real engineering projects.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/experience"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-[1.02]"
                >
                  View Experience Timeline
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/work"
                  className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
                >
                  Featured Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
      <WhatsAppButton phone={profile.socialLinks?.whatsapp || "923069609884"} />
      <BackToTop />
    </div>
  );
}
