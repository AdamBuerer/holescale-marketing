import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, Target, Clock, CheckCircle2, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KeyPoint {
  emoji: string;
  title: string;
  description: string;
}

interface Summary {
  tldr: string;
  keyPoints: KeyPoint[];
  targetAudience: string;
  actionItems: string[];
  estimatedTimeSaved: string;
}

interface AISummaryProps {
  content: string;
  title: string;
  readingTime: number;
  postId: string;
}

// Minimum display time for loading animation (makes cached results feel like AI processing)
const MIN_LOADING_TIME_MS = 800;

export function AISummary({ content, title, readingTime, postId }: AISummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [wasCached, setWasCached] = useState(false);

  const handleSummarize = async () => {
    if (summary) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-blog`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            content,
            title,
            readingTime,
            postId,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      // Ensure minimum loading time for smoother UX
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME_MS - elapsedTime));
      }

      setSummary(data.summary);
      setWasCached(data.cached || false);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8" style={{ overflow: 'visible' }}>
      {/* Summary Button */}
      <button
        onClick={handleSummarize}
        disabled={isLoading}
        style={{ overflow: 'visible' }}
        className={cn(
          'group w-full flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300',
          summary
            ? 'bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border-violet-200 dark:border-violet-800'
            : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:from-violet-50 hover:to-indigo-50 dark:hover:from-violet-950/30 dark:hover:to-indigo-950/30'
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1" style={{ overflow: 'visible' }}>
          <div className={cn(
            'w-10 h-10 min-w-[2.5rem] rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0',
            summary
              ? 'bg-violet-500 text-white'
              : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white group-hover:scale-110'
          )}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>
          <div className="text-left min-w-0">
            <span className="font-semibold text-foreground block truncate">
              {isLoading
                ? 'AI is analyzing this article...'
                : summary
                ? 'AI Summary'
                : 'Use AI to summarize this article'}
            </span>
            <span className="text-sm text-muted-foreground block truncate">
              {isLoading
                ? 'Extracting key insights and main points'
                : summary
                ? `Save ~${summary.estimatedTimeSaved} of reading time`
                : `Get key points in seconds instead of ${readingTime} min read`}
            </span>
          </div>
        </div>
        {summary && (
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 flex-shrink-0">
            {wasCached && (
              <span className="hidden sm:flex items-center gap-1 text-xs bg-violet-100 dark:bg-violet-900/50 px-2 py-1 rounded-full whitespace-nowrap">
                <Zap className="w-3 h-3 flex-shrink-0" />
                Instant
              </span>
            )}
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 flex-shrink-0" />
            )}
          </div>
        )}
      </button>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          <p className="font-medium">Unable to generate summary</p>
          <p className="text-sm mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setError(null);
              handleSummarize();
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Summary Content */}
      {summary && isExpanded && (
        <div className="mt-4 space-y-5 sm:space-y-6 animate-in slide-in-from-top-4 duration-500">
          {/* Quick Summary */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl text-white">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold uppercase tracking-wide text-sm">Quick Summary</span>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-white/95">{summary.tldr}</p>
          </div>

          {/* Key Points Grid */}
          <div>
            <h4 className="font-semibold text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500 flex-shrink-0" />
              <span>Key Takeaways</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {summary.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-muted/50 rounded-xl border border-border/50 hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0 leading-none">{point.emoji}</span>
                    <div className="min-w-0">
                      <h5 className="font-semibold text-foreground text-sm sm:text-base">{point.title}</h5>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Action Items</span>
            </h4>
            <ul className="space-y-2">
              {summary.actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
                  <span className="font-bold text-emerald-500 flex-shrink-0">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Audience & Time Saved */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted rounded-full">
              <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground flex-shrink-0">Best for:</span>
              <span className="font-medium truncate">{summary.targetAudience}</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-700 dark:text-violet-300">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="flex-shrink-0">Time saved:</span>
              <span className="font-semibold">{summary.estimatedTimeSaved}</span>
            </div>
          </div>

          {/* Attribution */}
          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
            Summary generated by AI • Read the full article for complete context
          </p>
        </div>
      )}
    </div>
  );
}

export default AISummary;
