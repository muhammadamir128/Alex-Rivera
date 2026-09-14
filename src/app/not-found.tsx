import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  let profile;
  try {
    profile = await getProfile();
  } catch {
    profile = null;
  }
  const name = profile?.name ?? "Portfolio";
  const socials = profile?.socialLinks ?? {};

  return (
    <div className="flex min-h-screen flex-col">
      {profile && <SiteHeader name={name} socials={socials} />}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20">
        {/* ambient */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px] animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px] animate-blob animation-delay-2000" />
        </div>

        <div className="relative text-center">
          <p className="font-display text-[clamp(6rem,18vw,14rem)] font-bold leading-none tracking-tighter gradient-text animate-gradient-pan">
            404
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            This page drifted into the void
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            The link you followed may be broken, or the page may have moved. Let&apos;s get you back
            to solid ground.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-600 shadow-lg shadow-violet-600/25">
              <Link href="/">
                <Home className="mr-1.5 h-4 w-4" />
                Back home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
              <Link href="/#work">
                <Search className="mr-1.5 h-4 w-4" />
                Browse work
              </Link>
            </Button>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Return to the portfolio
          </Link>
        </div>
      </main>
      {profile && <Footer profile={profile} />}
    </div>
  );
}
