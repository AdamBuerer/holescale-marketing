/**
 * Price Break Table Component
 * Displays tiered pricing (500 / 1,000 / 5,000 / 10,000 units)
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface PriceBreak {
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface PriceBreakTableProps {
  priceBreaks: PriceBreak[];
  basePrice?: number;
  moq?: number;
  className?: string;
}

export function PriceBreakTable({
  priceBreaks,
  basePrice,
  moq,
  className,
}: PriceBreakTableProps) {
  if (!priceBreaks || priceBreaks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">No price breaks available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by quantity
  const sortedBreaks = [...priceBreaks].sort((a, b) => a.quantity - b.quantity);

  // Calculate savings percentage
  const calculateSavings = (current: PriceBreak, previous?: PriceBreak) => {
    if (!previous) return null;
    const savings = ((previous.pricePerUnit - current.pricePerUnit) / previous.pricePerUnit) * 100;
    return savings > 0 ? savings : null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Volume Pricing
        </CardTitle>
        {moq && (
          <p className="text-sm text-muted-foreground">
            Minimum order quantity: {moq.toLocaleString()} units
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price per Unit</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
              <TableHead className="text-right">Savings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBreaks.map((breakItem, index) => {
              const previous = index > 0 ? sortedBreaks[index - 1] : undefined;
              const savings = calculateSavings(breakItem, previous);
              const isBestValue = index === sortedBreaks.length - 1 && savings !== null;

              return (
                <TableRow key={breakItem.quantity} className={isBestValue ? 'bg-muted/50' : ''}>
                  <TableCell className="font-medium">
                    {breakItem.quantity.toLocaleString()}+ units
                    {isBestValue && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Best Value
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${breakItem.pricePerUnit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${breakItem.totalPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {savings !== null ? (
                      <span className="text-green-600 font-medium">
                        -{savings.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {basePrice && sortedBreaks.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            <p>
              Base price: ${basePrice.toFixed(2)} per unit
              {sortedBreaks[0].pricePerUnit < basePrice && (
                <span className="text-green-600 ml-2">
                  (Save ${(basePrice - sortedBreaks[0].pricePerUnit).toFixed(2)} at {sortedBreaks[0].quantity.toLocaleString()}+ units)
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
