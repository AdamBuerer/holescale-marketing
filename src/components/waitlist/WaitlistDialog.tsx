import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { WaitlistForm } from './WaitlistForm';
import { Package, TrendingUp, Shield, CheckCircle, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: 'buyer' | 'supplier' | 'both';
}

export function WaitlistDialog({
  open,
  onOpenChange,
  defaultRole = 'buyer',
}: WaitlistDialogProps) {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'supplier'>(
    defaultRole === 'supplier' ? 'supplier' : 'buyer'
  );

  // Update selected role when defaultRole changes
  useEffect(() => {
    if (defaultRole === 'supplier') {
      setSelectedRole('supplier');
    } else if (defaultRole === 'buyer') {
      setSelectedRole('buyer');
    }
  }, [defaultRole]);

  const handleSuccess = () => {
    // Keep dialog open to show success state
    // Form will display success message with share options
  };

  const isBuyer = selectedRole === 'buyer';
  const isSupplier = selectedRole === 'supplier';

  const buyerBenefits = [
    { icon: Zap, text: 'Get quotes in 24-48 hours' },
    { icon: TrendingUp, text: 'Save 15-20% on packaging costs' },
    { icon: Shield, text: 'Only verified, vetted suppliers' },
  ];

  const supplierBenefits = [
    { icon: Users, text: 'Access qualified buyer leads' },
    { icon: Package, text: 'Showcase your products' },
    { icon: TrendingUp, text: 'Grow your business' },
  ];

  const benefits = isBuyer ? buyerBenefits : supplierBenefits;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[92vw] md:w-[88vw] lg:w-[85vw] xl:w-[82vw] 2xl:w-[78vw] lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] p-0 gap-0 overflow-hidden max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>
            {selectedRole === 'buyer' ? 'Join Waitlist - For Buyers' : 'Join Waitlist - For Suppliers'}
          </DialogTitle>
          <DialogDescription>
            {selectedRole === 'buyer' 
              ? 'Reserve your spot to source packaging smarter. Join procurement professionals on the waitlist for early access.'
              : 'Connect with qualified buyers actively looking for packaging suppliers. Grow your business with HoleScale.'}
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-0">
          {/* Left Panel - Visual & Benefits */}
          <div className={cn(
            'relative p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 2xl:p-12 flex flex-col justify-between',
            'min-h-[280px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[480px]',
            'order-2 lg:order-1',
            isBuyer
              ? 'bg-gradient-to-br from-primary via-primary/95 to-primary/90'
              : 'bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90'
          )}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] bg-[length:24px_24px]" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col">
              {/* Header */}
              <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-white/90 text-xs sm:text-sm md:text-base font-medium mb-2 sm:mb-3 md:mb-4">
                  {isBuyer ? 'For Buyers' : 'For Suppliers'}
                </span>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 leading-tight">
                  {isBuyer
                    ? 'Source Packaging Smarter'
                    : 'Grow Your Business'}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed max-w-full lg:max-w-md">
                  {isBuyer
                    ? 'Join procurement professionals on the waitlist for early access.'
                    : 'Connect with qualified buyers actively looking for packaging suppliers.'}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 flex-1">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <benefit.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 2xl:h-6 text-white" />
                    </div>
                    <span className="text-white font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="relative z-10 mt-4 sm:mt-5 md:mt-6 lg:mt-8 pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-white/20">
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white">Q1 2025</div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-white/70">Launch Date</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full" />
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-white/10 rounded-full" />
          </div>

          {/* Right Panel - Form */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-7 xl:p-9 2xl:p-12 bg-background overflow-x-hidden order-1 lg:order-2 min-h-0 flex flex-col">
            {/* Role Selection Tabs with Animated Gradients */}
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as 'buyer' | 'supplier')}>
                <TabsList className="grid w-full grid-cols-2 p-1 sm:p-1.5 md:p-2 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 relative overflow-visible rounded-lg border-2 border-primary/20 shadow-lg h-auto">
                  {/* Animated gradient background - rolling effect - more vibrant */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-secondary/60 via-primary/50 to-secondary/50 bg-[length:200%_100%] animate-gradient-x opacity-100 rounded-lg -z-0 blur-[0.5px]" />
                  {/* Additional shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-gradient-x opacity-60 rounded-lg -z-0" style={{ animationDelay: '1s', animationDuration: '3s' }} />
                  
                  <TabsTrigger 
                    value="buyer"
                    className={cn(
                      "relative z-10 font-semibold text-xs sm:text-sm md:text-base lg:text-base px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-500 rounded-md",
                      "min-w-0 w-full overflow-visible whitespace-nowrap",
                      "!data-[state=active]:bg-transparent !data-[state=active]:shadow-none",
                      selectedRole === 'buyer' 
                        ? "!bg-gradient-to-r from-primary via-primary/95 via-primary to-primary/90 !text-white shadow-2xl shadow-primary/50 animate-gradient-pulse border-2 border-primary/60 backdrop-blur-sm font-bold ring-2 ring-primary/30" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/70 bg-white/50 border-2 border-transparent hover:border-primary/20"
                    )}
                  >
                    <span className="relative z-10 drop-shadow-lg font-bold">For Buyers</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="supplier"
                    className={cn(
                      "relative z-10 font-semibold text-xs sm:text-sm md:text-base lg:text-base px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-500 rounded-md",
                      "min-w-0 w-full overflow-visible whitespace-nowrap",
                      "!data-[state=active]:bg-transparent !data-[state=active]:shadow-none",
                      selectedRole === 'supplier' 
                        ? "!bg-gradient-to-r from-secondary via-secondary/95 via-secondary to-secondary/90 !text-white shadow-2xl shadow-secondary/50 animate-gradient-pulse border-2 border-secondary/60 backdrop-blur-sm font-bold ring-2 ring-secondary/30" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/70 bg-white/50 border-2 border-transparent hover:border-secondary/20"
                    )}
                  >
                    <span className="relative z-10 drop-shadow-lg font-bold">For Suppliers</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>


            {/* Desktop Header */}
            <div className="hidden md:block mb-4 lg:mb-6 xl:mb-8">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-1.5 md:mb-2 lg:mb-3">
                Reserve Your Spot
              </h2>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg text-muted-foreground">
                Join early and get exclusive benefits when we launch.
              </p>
            </div>

            {/* Form */}
            <WaitlistForm
              defaultRole={selectedRole}
              onSuccess={handleSuccess}
              showCompanySize={true}
              showInterest={true}
              showReferralSource={false}
              compact={true}
            />

            {/* Trust Indicators */}
            <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 md:pt-4 border-t">
              <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-xs lg:text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>No Spam</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Free Forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* CSS Animations for Gradient Effects */}
      <style>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes gradient-pulse {
          0%, 100% {
            background-position: 0% 50%;
            transform: scale(1);
          }
          25% {
            background-position: 25% 50%;
            transform: scale(1.01);
          }
          50% {
            background-position: 100% 50%;
            transform: scale(1);
          }
          75% {
            background-position: 75% 50%;
            transform: scale(1.01);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease-in-out infinite;
        }
        
        .animate-gradient-pulse {
          animation: gradient-pulse 2.5s ease-in-out infinite;
          background-size: 200% 100%;
        }
      `}</style>
    </Dialog>
  );
}
