import { getAllPortfolioData } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Skills } from "@/components/site/skills";
import { Experience } from "@/components/site/experience";
import { Projects } from "@/components/site/projects";
import { Testimonials } from "@/components/site/testimonials";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { SectionDivider } from "@/components/site/section-divider";

export const revalidate = 0; // always fetch fresh admin-managed content

export default async function HomePage() {
  const { profile, skills, experience, projects, testimonials } = await getAllPortfolioData();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />
      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <SectionDivider className="my-4" variant="gradient" />
        <Skills skills={skills} />
        <SectionDivider className="my-4" variant="gradient" />
        <Projects projects={projects} />
        <SectionDivider className="my-4" variant="gradient" />
        <Experience items={experience} />
        {testimonials.length > 0 && (
          <>
            <SectionDivider className="my-4" variant="gradient" />
            <Testimonials items={testimonials} />
          </>
        )}
        <SectionDivider className="my-4" variant="gradient" />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <WhatsAppButton phone={profile.socialLinks?.whatsapp || "923069609884"} />
      <BackToTop />
    </div>
  );
}
