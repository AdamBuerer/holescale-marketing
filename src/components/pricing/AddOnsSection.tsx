import { Megaphone, Palette, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AddOnsSection() {
  const addOns = [
    {
      icon: Megaphone,
      title: "Sponsored Search + Featured Listing",
      price: "$500–$5,000/month",
      description: "Boost visibility with premium placement in search results and featured listings",
    },
    {
      icon: Palette,
      title: "Design Mockups & Branding",
      price: "10–15% fee",
      description: "Professional design services for custom packaging and branded merchandise",
    },
    {
      icon: DollarSign,
      title: "Financing Facilitation",
      price: "2–3% per deal",
      description: "Flexible payment options and financing solutions for large orders",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Promote Your Brand</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enhance your presence on HoleScale with premium add-ons and services
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {addOns.map((addon, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <addon.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{addon.title}</CardTitle>
              <CardDescription className="text-lg font-semibold text-primary">
                {addon.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{addon.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
