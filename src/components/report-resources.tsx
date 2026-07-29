import React, { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Link2, Globe, ShieldCheck, FileText } from "lucide-react";

export interface ResourceItem {
  title?: string;
  name?: string;
  url?: string;
  link?: string;
  href?: string;
  category?: string;
  cat?: string;
  type?: string;
  snippet?: string;
  description?: string;
  verified?: boolean;
}

interface ReportResourcesProps {
  resources?: ResourceItem[];
  sources?: ResourceItem[];
  reportContent?: string;
  title?: string;
  className?: string;
}

function parseMarkdownLinks(markdown?: string): ResourceItem[] {
  if (!markdown) return [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
  const results: ResourceItem[] = [];
  const seenUrls = new Set<string>();

  let match;
  while ((match = linkRegex.exec(markdown)) !== null) {
    const title = match[1].trim();
    const url = match[2].trim();
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      results.push({ title, url });
    }
  }
  return results;
}

function getDomain(urlStr?: string): string {
  if (!urlStr) return "";
  try {
    const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return urlStr;
  }
}

export function ReportResources({
  resources,
  sources,
  reportContent,
  title = "Resources & Citations",
  className = "",
}: ReportResourcesProps) {
  const [expanded, setExpanded] = useState(false);

  // Normalize items from resources, sources, or markdown content
  const rawItems = (resources && resources.length > 0)
    ? resources
    : (sources && sources.length > 0)
    ? sources
    : [];

  const normalizedList: ResourceItem[] = [];
  const seenUrls = new Set<string>();

  for (const item of rawItems) {
    const itemUrl = item.url || item.link || item.href || "";
    const itemTitle = item.title || item.name || getDomain(itemUrl) || "Reference Resource";
    const itemCat = item.category || item.cat || item.type;
    
    if (itemUrl && seenUrls.has(itemUrl.toLowerCase())) continue;
    if (itemUrl) seenUrls.add(itemUrl.toLowerCase());

    normalizedList.push({
      title: itemTitle,
      url: itemUrl,
      category: itemCat,
      snippet: item.snippet || item.description,
      verified: item.verified,
    });
  }

  // Fallback: If no explicit resources array or very few, parse links from markdown content
  if (normalizedList.length === 0 && reportContent) {
    const parsedLinks = parseMarkdownLinks(reportContent);
    for (const link of parsedLinks) {
      if (link.url && !seenUrls.has(link.url.toLowerCase())) {
        seenUrls.add(link.url.toLowerCase());
        normalizedList.push(link);
      }
    }
  }

  if (normalizedList.length === 0) {
    return null;
  }

  const initialLimit = 5;
  const hasMore = normalizedList.length > initialLimit;
  const visibleItems = expanded ? normalizedList : normalizedList.slice(0, initialLimit);

  return (
    <div className={`mt-8 border-t border-border/60 pt-6 animate-in fade-in duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <Link2 className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/90">
            {title}
          </h4>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {normalizedList.length}
          </span>
        </div>

        {/* {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-2.5 py-1 transition-colors"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Read More (+{normalizedList.length - initialLimit} more) <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )} */}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {visibleItems.map((item, idx) => {
          const domain = getDomain(item.url);
          return (
            <a
              key={idx}
              href={item.url || "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-white/90 p-3.5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-secondary/80 text-muted-foreground group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-foreground group-hover:text-brand-700 line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                    {domain && (
                      <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground truncate">
                        {domain}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-brand-600 transition-colors" />
              </div>

              {(item.category || item.verified !== undefined || item.snippet) && (
                <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-[10px]">
                  {item.category ? (
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-muted-foreground">
                      {item.category}
                    </span>
                  ) : item.snippet ? (
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {item.snippet}
                    </span>
                  ) : <span />}

                  {item.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200/80 bg-brand-50/70 px-5 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-100/70 hover:border-brand-300 transition-all shadow-soft w-full sm:w-auto"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read More ({normalizedList.length - initialLimit} additional resources) <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
