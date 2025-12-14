/**
 * Landed Cost Summary Component
 * Displays product price + estimated freight
 */

import { useState, useEffect } from 'react';
import { Truck, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface LandedCostSummaryProps {
  productId: string;
  quantity?: number;
  originZip?: string;
  destinationZip?: string;
  className?: string;
}

interface FreightOption {
  method: 'ground' | 'ltl' | 'ftl';
  estimatedDays: number;
  cost: number;
}

interface LandedCostData {
  productPrice: number;
  freightCost: number;
  totalLandedCost: number;
  freightOptions: FreightOption[];
  estimatedDeliveryDate: string;
}

export function LandedCostSummary({
  productId,
  quantity = 1,
  originZip,
  destinationZip,
  className,
}: LandedCostSummaryProps) {
  const [selectedMethod, setSelectedMethod] = useState<'ground' | 'ltl' | 'ftl'>('ground');
  const [landedCost, setLandedCost] = useState<LandedCostData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const calculateCost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('calculate-landed-cost', {
          body: {
            productId,
            quantity,
            originZip: originZip || '10001', // Default to NYC
            destinationZip: destinationZip || '90210', // Default to LA
            freightMethod: selectedMethod,
          },
        });

        if (error) throw error;
        setLandedCost(data);
      } catch (error) {
        console.error('Error calculating landed cost:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateCost();
  }, [productId, quantity, originZip, destinationZip, selectedMethod]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!landedCost) {
    return null;
  }

  const selectedFreight = landedCost.freightOptions.find((opt) => opt.method === selectedMethod) || landedCost.freightOptions[0];
  const deliveryDate = new Date(landedCost.estimatedDeliveryDate);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Landed Cost
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Freight Method Selector */}
        <div>
          <Label htmlFor="freight-method" className="text-sm font-medium mb-2 block">
            Shipping Method
          </Label>
          <Select value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'ground' | 'ltl' | 'ftl')}>
            <SelectTrigger id="freight-method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ground">
                <div className="flex items-center justify-between w-full">
                  <span>Ground Freight</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {landedCost.freightOptions.find((o) => o.method === 'ground')?.estimatedDays} days
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="ltl">
                <div className="flex items-center justify-between w-full">
                  <span>LTL (Less Than Truckload)</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {landedCost.freightOptions.find((o) => o.method === 'ltl')?.estimatedDays} days
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="ftl">
                <div className="flex items-center justify-between w-full">
                  <span>FTL (Full Truckload)</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {landedCost.freightOptions.find((o) => o.method === 'ftl')?.estimatedDays} days
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Product Price ({quantity} unit{quantity > 1 ? 's' : ''})</span>
            <span className="font-medium">${landedCost.productPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Freight ({selectedMethod.toUpperCase()})
            </span>
            <span className="font-medium">${selectedFreight.cost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total Landed Cost</span>
            <span>${(landedCost.productPrice + selectedFreight.cost).toFixed(2)}</span>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
          <Calendar className="h-4 w-4" />
          <span>
            Estimated delivery: {format(deliveryDate, 'MMM d, yyyy')} ({selectedFreight.estimatedDays} days)
          </span>
        </div>

        {/* Free Freight Badge */}
        {landedCost.productPrice >= 500 && (
          <Badge variant="secondary" className="w-full justify-center">
            Free freight over $500
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
