import { Shield, Lock, CheckCircle } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      text: "Secure Stripe Payments",
    },
    {
      icon: CheckCircle,
      text: "Verified Vendor Network",
    },
    {
      icon: Lock,
      text: "Data Encrypted",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 py-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
          <badge.icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
