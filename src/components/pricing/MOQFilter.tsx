/**
 * MOQ Filter Component
 * Filter products by minimum order quantity
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MOQFilterProps {
  minMOQ?: number;
  maxMOQ?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  className?: string;
}

export function MOQFilter({
  minMOQ,
  maxMOQ,
  onMinChange,
  onMaxChange,
  className,
}: MOQFilterProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Minimum Order Quantity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="moq-min" className="text-sm mb-2 block">
            Minimum MOQ
          </Label>
          <Input
            id="moq-min"
            type="number"
            placeholder="e.g., 100"
            value={minMOQ || ''}
            onChange={(e) => onMinChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="moq-max" className="text-sm mb-2 block">
            Maximum MOQ
          </Label>
          <Input
            id="moq-max"
            type="number"
            placeholder="e.g., 5000"
            value={maxMOQ || ''}
            onChange={(e) => onMaxChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className="h-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Show only products with MOQ within this range
        </p>
      </CardContent>
    </Card>
  );
}
