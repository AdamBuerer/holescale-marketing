import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

interface ComparePlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "supplier" | "buyer";
}

export function ComparePlansModal({ open, onOpenChange, userType }: ComparePlansModalProps) {
  const supplierFeatures = [
    { feature: "Profile Listing", basic: true, growth: true, enterprise: true },
    { feature: "RFQ Access", basic: "10/month", growth: "Unlimited", enterprise: "Unlimited" },
    { feature: "Analytics Dashboard", basic: true, growth: true, enterprise: true },
    { feature: "Featured Placement", basic: false, growth: true, enterprise: true },
    { feature: "Priority Support", basic: false, growth: true, enterprise: true },
    { feature: "Advanced Analytics", basic: false, growth: true, enterprise: true },
    { feature: "API Access", basic: false, growth: false, enterprise: true },
    { feature: "Custom Branding", basic: false, growth: false, enterprise: true },
    { feature: "Dedicated Account Manager", basic: false, growth: false, enterprise: true },
    { feature: "White-Glove Onboarding", basic: false, growth: false, enterprise: true },
  ];

  const buyerFeatures = [
    { feature: "Unlimited RFQs", standard: true, business: true, enterprise: true },
    { feature: "Supplier Directory Access", standard: true, business: true, enterprise: true },
    { feature: "Priority RFQs", standard: false, business: true, enterprise: true },
    { feature: "Advanced Search", standard: false, business: true, enterprise: true },
    { feature: "Bulk Templates", standard: false, business: true, enterprise: true },
    { feature: "Saved Suppliers", standard: false, business: true, enterprise: true },
    { feature: "Multi-User Accounts", standard: false, business: false, enterprise: true },
    { feature: "Spend Analytics", standard: false, business: false, enterprise: true },
    { feature: "Procurement Tools", standard: false, business: false, enterprise: true },
  ];

  const features = userType === "supplier" ? supplierFeatures : buyerFeatures;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare {userType === "supplier" ? "Supplier" : "Buyer"} Plans</DialogTitle>
          <DialogDescription>
            See what's included in each plan tier
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Feature</th>
                {userType === "supplier" ? (
                  <>
                    <th className="text-center py-3 px-4">Basic</th>
                    <th className="text-center py-3 px-4">Growth</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                  </>
                ) : (
                  <>
                    <th className="text-center py-3 px-4">Standard</th>
                    <th className="text-center py-3 px-4">Business</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {features.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{row.feature}</td>
                  {userType === "supplier" ? (
                    <>
                      <td className="text-center py-3 px-4">
                        {typeof row.basic === "boolean" ? (
                          row.basic ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{row.basic}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.growth === "boolean" ? (
                          row.growth ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{row.growth}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{row.enterprise}</span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="text-center py-3 px-4">
                        {typeof row.standard === "boolean" ? (
                          row.standard ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{row.standard}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.business === "boolean" ? (
                          row.business ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{row.business}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{row.enterprise}</span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
