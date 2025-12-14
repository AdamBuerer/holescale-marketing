import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserCurrentTier } from "@/lib/pricing";
import { Crown, Zap, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const UserTierBadge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState<any>(null);

  useEffect(() => {
    if (user) loadTier();
  }, [user]);

  const loadTier = async () => {
    if (!user) return;
    const tier = await getUserCurrentTier(user.id);
    setCurrentTier(tier);
  };

  if (!currentTier) return null;

  const getTierIcon = () => {
    switch(currentTier.tier_name) {
      case "basic": return <Zap className="w-4 h-4" />;
      case "business": return <Star className="w-4 h-4" />;
      case "pro": return <Star className="w-4 h-4" />;
      case "enterprise": return <Crown className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTierColor = () => {
    switch(currentTier.tier_name) {
      case "basic": return "bg-blue-100 text-blue-700 border-blue-300";
      case "business": return "bg-purple-100 text-purple-700 border-purple-300";
      case "pro": return "bg-purple-100 text-purple-700 border-purple-300";
      case "enterprise": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${getTierColor()}`}>
      {getTierIcon()}
      <span className="font-semibold capitalize text-sm">
        {currentTier.tier_name}
      </span>
      {currentTier.tier_name !== "free" && currentTier.tier_name !== "enterprise" && (
        <Button 
          onClick={() => navigate("/pricing")}
          variant="ghost"
          size="sm"
          className="h-auto py-0 px-2 text-xs underline"
        >
          Upgrade
        </Button>
      )}
    </div>
  );
};