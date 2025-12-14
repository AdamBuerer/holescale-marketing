import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const navigate = useNavigate();
  const { user, roles } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return "/";
    if (roles.includes("admin")) return "/admin/dashboard";
    if (roles.includes("supplier")) return "/supplier/dashboard";
    return "/buyer/dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Illustration */}
          <div className="mb-8">
            <div className="mx-auto w-48 h-48 rounded-full bg-muted/30 flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <p className="text-7xl font-bold text-primary">404</p>
                <Search className="h-12 w-12 mx-auto mt-2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate(getDashboardRoute())}
              className="min-w-[200px]"
            >
              <Home className="h-5 w-5 mr-2" />
              {user ? "Go to Dashboard" : "Go Home"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="min-w-[200px]"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">Need help? Try these:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {user ? (
                <>
                  {roles.includes("buyer") && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/buyer/rfq/new")}
                      >
                        Post an RFQ
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(user ? "/buyer/suppliers" : "/auth?redirect=/buyer/suppliers")}
                      >
                        Find Suppliers
                      </Button>
                    </>
                  )}
                  {roles.includes("supplier") && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/supplier/rfq-marketplace")}
                      >
                        Browse RFQs
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/supplier/products")}
                      >
                        My Products
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/buyer/support")}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Contact Support
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/how-it-works")}
                  >
                    How It Works
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/for-buyers")}
                  >
                    For Buyers
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/for-suppliers")}
                  >
                    For Suppliers
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/contact")}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Contact Us
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
