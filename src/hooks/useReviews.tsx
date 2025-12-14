import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export interface Review {
  id: string;
  reviewer_id: string;
  supplier_id: string;
  order_id: string | null;
  rating: number;
  review_title: string;
  review_text: string;
  quality_rating: number;
  communication_rating: number;
  delivery_rating: number;
  value_rating: number;
  verified_purchase: boolean;
  helpful_count: number;
  supplier_response: string | null;
  supplier_response_at: string | null;
  images: string[];
  created_at: string;
  profiles: {
    full_name: string;
    company_name: string;
    avatar_url: string;
  };
}

export function useReviews() {
  const [loading, setLoading] = useState(false);

  const loadReviews = async (supplierId: string) => {
    setLoading(true);
    try {
      // First get reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        logger.error("Error loading reviews", { error: reviewsError });
        toast.error("Failed to load reviews");
        return [];
      }

      if (!reviewsData || reviewsData.length === 0) {
        return [];
      }

      // Get reviewer profiles separately
      const reviewerIds = [...new Set(reviewsData.map(r => r.reviewer_id).filter(Boolean))];
      let profilesMap = new Map();

      if (reviewerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, company_name, avatar_url")
          .in("id", reviewerIds);

        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
      }

      // Combine reviews with profiles
      const enrichedReviews = reviewsData.map(review => ({
        ...review,
        profiles: profilesMap.get(review.reviewer_id) || null,
      }));

      return enrichedReviews;
    } catch (error) {
      logger.error("Error in loadReviews", { error });
      toast.error("Failed to load reviews");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (review: {
    supplier_id: string;
    order_id?: string;
    rating: number;
    review_title: string;
    review_text: string;
    quality_rating: number;
    communication_rating: number;
    delivery_rating: number;
    value_rating: number;
    images?: string[];
  }) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to submit a review");
      return null;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        ...review,
        reviewer_id: user.user.id,
        verified_purchase: !!review.order_id,
        images: review.images || [],
      })
      .select()
      .maybeSingle();

    if (error) {
      toast.error("Failed to submit review");
      return null;
    }

    toast.success("Review submitted successfully!");
    return data;
  };

  const updateReview = async (reviewId: string, updates: Partial<Review>) => {
    const { error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", reviewId);

    if (error) {
      toast.error("Failed to update review");
      return false;
    }

    toast.success("Review updated successfully!");
    return true;
  };

  const addSupplierResponse = async (reviewId: string, response: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({
        supplier_response: response,
        supplier_response_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (error) {
      toast.error("Failed to add response");
      return false;
    }

    toast.success("Response added successfully!");
    return true;
  };

  const voteHelpful = async (reviewId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to vote");
      return false;
    }

    // Check if already voted
    const { data: existing, error: voteError } = await supabase
      .from("review_votes")
      .select()
      .eq("review_id", reviewId)
      .eq("user_id", user.user.id)
      .maybeSingle();

    if (voteError) {
      logger.error('Error checking vote', { error: voteError });
    }

    if (existing) {
      // Remove vote
      const { error } = await supabase
        .from("review_votes")
        .delete()
        .eq("review_id", reviewId)
        .eq("user_id", user.user.id);

      if (error) {
        toast.error("Failed to remove vote");
        return false;
      }
      return true;
    }

    // Add vote
    const { error } = await supabase
      .from("review_votes")
      .insert({ review_id: reviewId, user_id: user.user.id });

    if (error) {
      toast.error("Failed to vote");
      return false;
    }

    return true;
  };

  const checkUserVoted = async (reviewId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data, error } = await supabase
      .from("review_votes")
      .select()
      .eq("review_id", reviewId)
      .eq("user_id", user.user.id)
      .maybeSingle();

    if (error) {
      logger.error('Error checking user vote', { error });
      return false;
    }

    return !!data;
  };

  return {
    loading,
    loadReviews,
    createReview,
    updateReview,
    addSupplierResponse,
    voteHelpful,
    checkUserVoted,
  };
}
