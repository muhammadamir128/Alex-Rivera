// Generates themed cover images + avatars for the portfolio seed data.
// Run with: bun prisma/generate-images.ts
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(OUT, { recursive: true });

type Job = { prompt: string; size: string; name: string };

const jobs: Job[] = [
  // Project covers (landscape 1344x768)
  {
    prompt:
      "Abstract UI dashboard for a real-time analytics platform, dark navy background #0a0e1a with electric blue to violet gradient accent charts and line graphs, glassmorphism cards, futuristic data visualization, clean minimal, high detail, no text",
    size: "1344x768",
    name: "project-aurora.png",
  },
  {
    prompt:
      "E-commerce storefront UI mockup on dark navy background, product cards with glassmorphism, neon blue to violet gradient highlights, premium minimalist aesthetic, high detail product photography style, no text",
    size: "1344x768",
    name: "project-lumen.png",
  },
  {
    prompt:
      "Abstract real-time chat application interface, dark theme navy #0a0e1a, glowing message bubbles with blue to violet gradient, conversation threads, modern UI, high detail, no readable text",
    size: "1344x768",
    name: "project-pulse.png",
  },
  {
    prompt:
      "Headless CMS block editor UI concept, dark navy background, content blocks being arranged, glassmorphism panels, blue violet gradient accents, clean modern dashboard, high detail, no readable text",
    size: "1344x768",
    name: "project-trailhead.png",
  },
  {
    prompt:
      "Personal finance dashboard UI, dark theme navy background, budget envelopes and charts with blue to violet gradient, glassmorphism cards, clean fintech aesthetic, high detail, no readable text",
    size: "1344x768",
    name: "project-fern.png",
  },
  {
    prompt:
      "Documentation website UI concept, dark navy theme, code blocks with syntax highlighting, blue violet gradient accents, sidebar navigation, modern developer docs aesthetic, high detail, no readable text",
    size: "1344x768",
    name: "project-atlas.png",
  },
  // Testimonial avatars (square)
  {
    prompt:
      "Professional studio portrait of a confident woman with short dark hair, soft cinematic lighting on dark navy background, subtle blue rim light, photorealistic, high detail headshot",
    size: "1024x1024",
    name: "testimonial-sara.png",
  },
  {
    prompt:
      "Professional studio portrait of a man in his 30s with stubble and glasses, soft cinematic lighting on dark navy background, subtle violet rim light, photorealistic, high detail headshot",
    size: "1024x1024",
    name: "testimonial-marko.png",
  },
  {
    prompt:
      "Professional studio portrait of a South Asian woman with long hair, confident expression, soft cinematic lighting on dark navy background, subtle blue rim light, photorealistic, high detail headshot",
    size: "1024x1024",
    name: "testimonial-priya.png",
  },
  {
    prompt:
      "Professional studio portrait of a man in his 40s with beard, friendly expression, soft cinematic lighting on dark navy background, subtle violet rim light, photorealistic, high detail headshot",
    size: "1024x1024",
    name: "testimonial-jonas.png",
  },
  // Admin avatar
  {
    prompt:
      "Professional studio portrait of a confident developer in his late 20s, casual smart attire, soft cinematic lighting on dark navy background, blue to violet gradient rim light, photorealistic, high detail headshot",
    size: "1024x1024",
    name: "avatar-real.png",
  },
];

async function run() {
  console.log(`Generating ${jobs.length} images...`);
  const zai = await ZAI.create();
  let done = 0;
  for (const job of jobs) {
    const outPath = path.join(OUT, job.name);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      console.log(`✓ skip (exists): ${job.name}`);
      done++;
      continue;
    }
    try {
      const res = await zai.images.generations.create({
        prompt: job.prompt,
        size: job.size as never,
      });
      const b64 = res.data[0].base64;
      fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
      done++;
      console.log(`✓ [${done}/${jobs.length}] ${job.name} (${(fs.statSync(outPath).size / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.error(`✗ failed ${job.name}:`, (e as Error).message);
    }
  }
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
