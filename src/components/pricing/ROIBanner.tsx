import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function ROIBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 rounded-xl p-6 text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold">Average ROI: 15×</h3>
      </div>
      <p className="text-muted-foreground">
        Suppliers earn an average of <span className="font-semibold text-foreground">15× their subscription</span> in closed deals
      </p>
    </motion.div>
  );
}
