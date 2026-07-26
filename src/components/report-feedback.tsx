import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, Send, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ReportFeedbackProps {
  reportId?: string;
  className?: string;
}

export function ReportFeedback({ reportId, className = "" }: ReportFeedbackProps) {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const likeTags = ["Accurate & verified", "Clear structure", "Comprehensive insights", "Actionable recommendations"];
  const dislikeTags = ["Needs more detail", "Inaccurate information", "Outdated sources", "Formatting issue", "Too vague"];

  const handleLike = () => {
    if (feedback === "like") {
      setFeedback(null);
      setSubmitted(false);
      return;
    }
    setFeedback("like");
    setSelectedTags([]);
    setSubmitted(false);
    toast.success("Thank you for your feedback!", {
      description: "We're glad this AI report was helpful to you.",
      icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
    });
  };

  const handleDislike = () => {
    if (feedback === "dislike") {
      setFeedback(null);
      setSubmitted(false);
      return;
    }
    setFeedback("dislike");
    setSelectedTags([]);
    setSubmitted(false);
    toast.info("Thanks for letting us know", {
      description: "Please select what we can improve to make future reports better.",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Review submitted!", {
      description: "Your feedback will help train and refine our AI multi-agent models.",
    });
  };

  return (
    <div className={`mt-6 rounded-2xl border border-border/70 bg-gradient-to-br from-secondary/30 via-background to-secondary/20 p-4 shadow-sm transition-all sm:p-5 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Was this report helpful?
            </h4>
            <p className="text-xs text-muted-foreground/80">
              Help us improve Sarthi AI's multi-agent intelligence.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLike}
            className={`group inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
              feedback === "like"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm ring-2 ring-emerald-500/20"
                : "border-border bg-white text-muted-foreground hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
            }`}
          >
            <ThumbsUp
              className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ${
                feedback === "like" ? "fill-emerald-600 text-emerald-600" : ""
              }`}
            />
            <span>Helpful</span>
          </button>

          <button
            type="button"
            onClick={handleDislike}
            className={`group inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
              feedback === "dislike"
                ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20"
                : "border-border bg-white text-muted-foreground hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-700"
            }`}
          >
            <ThumbsDown
              className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ${
                feedback === "dislike" ? "fill-rose-600 text-rose-600" : ""
              }`}
            />
            <span>Needs Work</span>
          </button>
        </div>
      </div>

      {/* Interactive Review Section */}
      {feedback && !submitted && (
        <form onSubmit={handleSubmitReview} className="mt-4 pt-3 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-xs font-semibold text-foreground/90">
            {feedback === "like"
              ? "What did you like about this report?"
              : "What could be improved in this report?"}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {(feedback === "like" ? likeTags : dislikeTags).map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                    active
                      ? feedback === "like"
                        ? "border-emerald-300 bg-emerald-100/70 text-emerald-800 font-semibold"
                        : "border-rose-300 bg-rose-100/70 text-rose-800 font-semibold"
                      : "border-border/70 bg-white/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Additional feedback or comments (optional)..."
              className="min-w-0 flex-1 rounded-xl border border-border/80 bg-white px-3 py-1.5 text-xs outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-glow hover:opacity-95"
            >
              <Send className="h-3 w-3" /> Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Response after submission */}
      {submitted && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200/80 animate-in fade-in duration-200">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Review submitted! Thank you for helping us optimize our AI agent accuracy.</span>
        </div>
      )}
    </div>
  );
}
