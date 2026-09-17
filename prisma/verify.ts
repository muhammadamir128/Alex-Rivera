import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const profile = await prisma.profile.findFirst();
  const skills = await prisma.skill.findMany();
  const exp = await prisma.experience.findMany();
  const edu = await prisma.education.findMany();
  const projects = await prisma.project.findMany();
  const testimonials = await prisma.testimonial.findMany();

  console.log("=== DB DATA ===");
  console.log("Profile:", JSON.stringify(profile, null, 2));
  console.log("Education count:", edu.length, JSON.stringify(edu, null, 2));
  console.log("=========================");

  await prisma.$disconnect();
}

check().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
