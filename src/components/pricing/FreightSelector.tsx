/**
 * Freight Selector Component
 * Standalone freight method selector
 */

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck } from 'lucide-react';

export type FreightMethod = 'ground' | 'ltl' | 'ftl';

interface FreightSelectorProps {
  value: FreightMethod;
  onChange: (method: FreightMethod) => void;
  options?: Array<{
    method: FreightMethod;
    label: string;
    estimatedDays: number;
    cost?: number;
  }>;
  className?: string;
}

const defaultOptions = [
  { method: 'ground' as FreightMethod, label: 'Ground Freight', estimatedDays: 3 },
  { method: 'ltl' as FreightMethod, label: 'LTL (Less Than Truckload)', estimatedDays: 5 },
  { method: 'ftl' as FreightMethod, label: 'FTL (Full Truckload)', estimatedDays: 7 },
];

export function FreightSelector({
  value,
  onChange,
  options = defaultOptions,
  className,
}: FreightSelectorProps) {
  return (
    <div className={className}>
      <Label htmlFor="freight-method" className="text-sm font-medium mb-2 block flex items-center gap-2">
        <Truck className="h-4 w-4" />
        Shipping Method
      </Label>
      <Select value={value} onValueChange={(val) => onChange(val as FreightMethod)}>
        <SelectTrigger id="freight-method">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.method} value={option.method}>
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {option.cost && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ${option.cost.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-2">
                  {option.estimatedDays} days
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
