import { GraduationCap, Calendar, MapPin, Award, BookOpen } from "lucide-react";
import type { EducationData } from "@/lib/data";

function formatDate(yyyy_mm: string) {
  if (!yyyy_mm) return "";
  const [y, m] = yyyy_mm.split("-");
  if (!y || !m) return yyyy_mm;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = parseInt(m, 10) - 1;
  return `${months[idx] || m} ${y}`;
}

export function EducationSection({ items }: { items: EducationData[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      <div className="grid gap-6 sm:gap-8">
        {items.map((edu, idx) => (
          <div
            key={edu.id}
            className="group relative overflow-hidden rounded-3xl glass p-6 sm:p-8 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/5"
          >
            {/* Background ambient glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Academic Icon badge */}
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-transparent ring-1 ring-white/15 text-blue-400 shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="h-7 w-7" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {edu.degree}
                    </h3>
                    {edu.current && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                        In Progress
                      </span>
                    )}
                    {edu.grade && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/30">
                        <Award className="h-3.5 w-3.5" />
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-base font-medium text-blue-400 sm:text-lg">
                    {edu.institution}
                    {edu.field && (
                      <span className="text-muted-foreground font-normal text-sm sm:text-base">
                        {" "}· {edu.field}
                      </span>
                    )}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      {formatDate(edu.startDate)} — {edu.current ? "Present" : formatDate(edu.endDate || "")}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" />
                        {edu.location}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base max-w-3xl">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
