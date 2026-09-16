import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Contact } from "@/components/site/contact";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Clock, ShieldCheck, Sparkles } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Contact | ${profile.name} — ${profile.title}`,
    description: "Get in touch for freelance inquiries, full-time engineering roles, or consulting.",
  };
}

export default async function ContactPage() {
  const profile = await getProfile();

  const faqs = [
    {
      q: "What is your typical availability and start timeline?",
      a: "I am generally able to kick off new projects within 1 to 2 weeks. For urgent hotfixes or quick architecture consultations, reach out directly and I can often accommodate quicker schedules.",
    },
    {
      q: "What types of projects do you take on?",
      a: "I specialize in end-to-end full-stack web applications, interactive SaaS dashboards, component design systems, and database-backed platforms using Next.js, React, Node.js, and TypeScript.",
    },
    {
      q: "How do you handle project communication?",
      a: "I believe in clear, proactive communication. I typically work via Slack, Discord, email, and scheduled weekly Zoom / Google Meet check-ins with transparent staging environment deployments.",
    },
    {
      q: "Do you offer post-launch support and maintenance?",
      a: "Yes! Every project includes a warranty period after deployment to ensure stability, plus optional retainer packages for ongoing feature additions, performance audits, and dependency updates.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader name={profile.name} socials={profile.socialLinks} />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Contact</span>
          </div>

          {/* Header section */}
          <div className="mt-8 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
              <span className="h-px w-8 bg-cyan-400/60" />
              Get In Touch
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Let&apos;s build something <span className="gradient-text">extraordinary</span>.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Have a product you want to build, a team that needs experienced hands, or just a technical question? Drop me a message below — I personally review and reply to every message within 24 hours.
            </p>
          </div>

          {/* Quick value badges */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>Fast response time (&lt;24 hours)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>NDA & IP protection guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>Free discovery consultation</span>
            </div>
          </div>
        </div>

        {/* Contact form and details */}
        <div className="-mt-12">
          <Contact profile={profile} />
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-16">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
              <span>Got Questions?</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Quick answers about how I collaborate, bill, and support clients.
            </p>
          </div>

          <div className="mt-8 rounded-3xl glass p-6 sm:p-8">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-white/5 px-2 last:border-0"
                >
                  <AccordionTrigger className="text-left font-display text-sm sm:text-base font-semibold text-foreground/90 hover:text-blue-400 transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
      <WhatsAppButton phone={profile.socialLinks?.whatsapp || "923069609884"} />
      <BackToTop />
    </div>
  );
}
