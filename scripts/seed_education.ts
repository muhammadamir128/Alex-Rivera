import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.education.count();
  if (count === 0) {
    await prisma.education.create({
      data: {
        degree: "Bachelor of Science in Computer Science (BSCS)",
        institution: "University of Engineering & Technology",
        field: "Computer Science & Software Systems",
        location: "Lahore, Pakistan",
        startDate: "2019-09",
        endDate: "2023-07",
        current: false,
        grade: "3.7 / 4.0 CGPA",
        description: "Specialized in distributed systems, full-stack web architecture, database design, and algorithmic problem solving. Developed an end-to-end cloud collaboration portal for final year capstone.",
        order: 1,
      },
    });
    console.log("Seeded initial education record successfully!");
  } else {
    console.log(`Education table already has ${count} records.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
