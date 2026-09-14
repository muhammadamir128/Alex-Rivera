import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getTestimonials } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { Testimonials } from "@/components/site/testimonials";
import { Star, MessageSquareQuote, ThumbsUp, ShieldCheck, ArrowRight } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Voices & Testimonials | ${profile.name} — ${profile.title}`,
    description: "Client reviews, colleague recommendations, and collaborative endorsements.",
  };
}

export default async function TestimonialsPage() {
  const [profile, testimonials] = await Promise.all([getProfile(), getTestimonials()]);

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Voices</span>
          </div>

          {/* Header section */}
          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
              <span className="h-px w-8 bg-violet-400/60" />
              Client Feedback
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Trusted by founders, <span className="gradient-text">cherished by teams</span>.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Nothing speaks louder than the words of people who&apos;ve worked shoulder-to-shoulder with me. Here is authentic feedback from clients, team leads, and peers.
            </p>
          </div>

          {/* Metrics summary */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                Average Rating
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {avgRating} / 5.0
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Flawless project ratings</p>
            </div>

            <div className="rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <ThumbsUp className="h-4 w-4 text-emerald-400" />
                Satisfaction
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-emerald-400 tabular-nums">
                100%
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Recommendation rate</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl glass p-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <MessageSquareQuote className="h-4 w-4 text-blue-400" />
                Verified Voices
              </div>
              <div className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
                {testimonials.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Endorsements & reviews</p>
            </div>
          </div>
        </div>

        {/* Testimonials section with carousel & grid views */}
        <div className="-mt-8">
          <Testimonials items={testimonials} />
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
          <div className="overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center relative">
            <div className="relative max-w-xl mx-auto">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to be the next success story?
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Whether you have a tight deadline, a complex redesign, or a greenfield app to launch, let&apos;s build something great together.
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-[1.02]"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/work"
                  className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
                >
                  See Past Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
      <BackToTop />
    </div>
  );
}
