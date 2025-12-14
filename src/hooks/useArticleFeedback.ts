import { useState } from 'react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

// Simplified feedback system - database integration will work after types are regenerated
export function useArticleFeedback(articleId: string) {
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (helpful: boolean) => {
    setIsSubmitting(true);

    // For now, store in localStorage until types are regenerated
    try {
      const feedbackKey = `article-feedback-${articleId}`;
      localStorage.setItem(feedbackKey, JSON.stringify(helpful));
      
      setHasVoted(true);
      setUserVote(helpful);
      
      toast.success(
        helpful 
          ? 'Thanks for your feedback!' 
          : "We'll work to improve this article."
      );
    } catch (error) {
      logger.error('Error submitting feedback', { error });
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    hasVoted,
    userVote,
    isSubmitting,
    submitFeedback
  };
}
