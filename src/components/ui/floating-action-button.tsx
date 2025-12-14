import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({
  onClick,
  label,
  icon = <Plus className="h-6 w-6" />,
  className,
}: FloatingActionButtonProps) {
  return (
    <Button
      size="lg"
      className={cn(
        "fixed bottom-20 right-4 h-14 rounded-full shadow-lg hover:shadow-xl transition-all z-40 md:hidden",
        label ? "px-6" : "w-14 p-0",
        className
      )}
      onClick={onClick}
    >
      {icon}
      {label && <span className="ml-2 font-semibold">{label}</span>}
    </Button>
  );
}
