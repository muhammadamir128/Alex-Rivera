import { cn } from "@/lib/utils";

/**
 * Lightweight markdown-ish renderer tuned for project case studies.
 * Supports: # h1, ## h2, ### h3, - bullet lists, > blockquote, `inline code`,
 * ```code blocks```, **bold**, plain paragraphs. No external deps.
 */
export function CaseStudy({ source, className }: { source: string; className?: string }) {
  if (!source.trim()) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        A full case study is coming soon.
      </p>
    );
  }

  const blocks = source.split(/\n{2,}/);
  const elements: React.ReactNode[] = [];

  blocks.forEach((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // code fence
    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const lang = lines[0].replace(/^```/, "").trim();
      const code = lines.slice(1, -1).join("\n").trim();
      elements.push(
        <pre
          key={idx}
          className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[13px] leading-relaxed text-foreground/85"
        >
          {lang && (
            <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              {lang}
            </div>
          )}
          <code className="font-mono">{code}</code>
        </pre>
      );
      return;
    }

    // headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={idx} className="mt-6 font-display text-base font-semibold text-foreground">
          {inline(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3
          key={idx}
          className="mt-8 flex items-center gap-2 font-display text-lg font-semibold text-foreground"
        >
          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-blue-400 to-violet-500" />
          {inline(trimmed.slice(3))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={idx} className="mt-8 font-display text-2xl font-bold text-foreground">
          {inline(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // blockquote
    if (trimmed.startsWith("> ")) {
      const text = trimmed
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join(" ");
      elements.push(
        <blockquote
          key={idx}
          className="my-4 border-l-2 border-blue-400/50 bg-blue-500/[0.04] py-2 pl-4 text-sm italic text-foreground/80"
        >
          {inline(text)}
        </blockquote>
      );
      return;
    }

    // unordered list
    const lines = trimmed.split("\n");
    if (lines.every((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))) {
      elements.push(
        <ul key={idx} className="my-3 space-y-1.5">
          {lines.map((l, j) => (
            <li key={j} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-400 to-violet-500" />
              <span className="flex-1">{inline(l.replace(/^[-*]\s+/, ""))}</span>
            </li>
          ))}
        </ul>
      );
      return;
    }
    if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
      elements.push(
        <ol key={idx} className="my-3 list-decimal space-y-1.5 pl-5 marker:text-blue-400">
          {lines.map((l, j) => (
            <li key={j} className="text-sm text-foreground/80">
              {inline(l.replace(/^\d+\.\s+/, ""))}
            </li>
          ))}
        </ol>
      );
      return;
    }

    // paragraph
    elements.push(
      <p key={idx} className="my-3 text-sm leading-relaxed text-foreground/75">
        {inline(trimmed)}
      </p>
    );
  });

  return <div className={cn("space-y-0", className)}>{elements}</div>;
}

/** Inline markdown: `code`, **bold**, *italic*, [text](url) */
function inline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code key={key++} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-blue-200">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key++} className="italic text-foreground/90">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (mm) {
        nodes.push(
          <a
            key={key++}
            href={mm[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline decoration-blue-400/40 underline-offset-2 transition-colors hover:text-blue-300"
          >
            {mm[1]}
          </a>
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
