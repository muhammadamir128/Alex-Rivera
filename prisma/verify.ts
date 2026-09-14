import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const profile = await prisma.profile.findFirst();
  const skills = await prisma.skill.count();
  const exp = await prisma.experience.count();
  const projects = await prisma.project.count();

  console.log("=== NEON DB LIVE DATA ===");
  console.log("Profile Name :", profile?.name);
  console.log("Profile Title:", profile?.title);
  console.log("Skills       :", skills);
  console.log("Experience   :", exp);
  console.log("Projects     :", projects);
  console.log("=========================");

  await prisma.$disconnect();
}

check().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
