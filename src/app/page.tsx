import { getAllPortfolioData } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Skills } from "@/components/site/skills";
import { Experience } from "@/components/site/experience";
import { Projects } from "@/components/site/projects";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { SectionDivider } from "@/components/site/section-divider";

import { TechTicker } from "@/components/site/tech-ticker";
import { GsapScrollEffects } from "@/components/site/gsap-scroll-effects";

export const revalidate = 0; // always fetch fresh admin-managed content

export default async function HomePage() {
  const { profile, skills, experience, projects } = await getAllPortfolioData();

  return (
    <div className="flex min-h-screen flex-col">
      <GsapScrollEffects />
      <SiteHeader name={profile.name} socials={profile.socialLinks} />
      <main className="flex-1">
        <Hero profile={profile} />
        <TechTicker />
        <About profile={profile} />
        <SectionDivider className="my-0" variant="gradient" />
        <Skills skills={skills} />
        <SectionDivider className="my-0" variant="gradient" />
        <Experience items={experience} />
        <SectionDivider className="my-0" variant="gradient" />
        <Projects projects={projects} />
        <SectionDivider className="my-0" variant="gradient" />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <WhatsAppButton phone={profile.socialLinks?.whatsapp || "923064609884"} />
      <BackToTop />
    </div>
  );
}
