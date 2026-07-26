import React from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, ShieldCheck, HelpCircle, FileText, ExternalLink, Lightbulb } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Pre-process content to ensure standard markdown headers for section titles like "Executive Summary:", "Key Insights:", etc.
  const normalizedContent = content
    .replace(/^(Executive Summary:?)/gim, "### Executive Summary")
    .replace(/^(Key Insights:?)/gim, "### Key Insights")
    .replace(/^(Recommendations:?)/gim, "### Recommendations")
    .replace(/^(Sources:?)/gim, "### Sources")
    .replace(/^(Confidence Score:?)/gim, "### Confidence Score");

  return (
    <div className={`markdown-report space-y-4 font-sans text-[15px] leading-relaxed text-foreground/90 ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 font-display text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-3 font-display text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-600 inline-block"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => {
            const title = String(children);
            let icon = <FileText className="h-4 w-4 text-brand-600" />;
            if (title.includes("Executive Summary")) icon = <FileText className="h-4.5 w-4.5 text-brand-600" />;
            if (title.includes("Key Insights")) icon = <Lightbulb className="h-4.5 w-4.5 text-amber-600" />;
            if (title.includes("Recommendations")) icon = <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />;
            if (title.includes("Sources")) icon = <ExternalLink className="h-4.5 w-4.5 text-blue-600" />;
            if (title.includes("Confidence")) icon = <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />;

            return (
              <h3 className="mt-6 mb-3 font-display text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <div className="p-1 rounded-md bg-secondary/80">{icon}</div>
                {children}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 text-base font-semibold text-foreground">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-[15px] leading-relaxed text-foreground/90">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 space-y-2 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-2 pl-4 list-decimal marker:font-semibold marker:text-brand-600">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <div className="flex-1">{children}</div>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/80">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-xl border-l-4 border-brand-500 bg-secondary/40 p-4 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-brand-700">
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              {children}
              <ExternalLink className="h-3 w-3" />
            </a>
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
