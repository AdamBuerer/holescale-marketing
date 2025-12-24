import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/ui/FadeIn';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";
import { trackToolUsage } from '@/lib/analytics';
import { usePageTracking } from '@/hooks/useAnalytics';

type ProductType = 'mailer-box' | 'rigid-box' | 'poly-mailer' | 'corrugated-box' | 'folding-carton' | 'custom';

interface VolumeBreak {
  qty: number;
  discount: number;
}

interface ProductPreset {
  name: string;
  baseUnit: number;
  setup: number;
  description: string;
  volumeBreaks: VolumeBreak[];
}

interface Calculation {
  quantity: number;
  unitCost: string;
  subtotal: string;
  setupFee: string;
  total: string;
  effectiveUnitCost: string;
  discount: string;
  savings: string;
}

const productPresets: Record<ProductType, ProductPreset> = {
  'mailer-box': {
    name: 'Custom Mailer Box',
    baseUnit: 2.50,
    setup: 250,
    description: '10x8x4" kraft mailer, 1-color print',
    volumeBreaks: [
      { qty: 100, discount: 0 },
      { qty: 250, discount: 0.10 },
      { qty: 500, discount: 0.18 },
      { qty: 1000, discount: 0.25 },
      { qty: 2500, discount: 0.32 },
      { qty: 5000, discount: 0.38 },
      { qty: 10000, discount: 0.45 }
    ]
  },
  'rigid-box': {
    name: 'Rigid Setup Box',
    baseUnit: 5.00,
    setup: 500,
    description: '8x6x3" rigid box, full wrap print',
    volumeBreaks: [
      { qty: 100, discount: 0 },
      { qty: 250, discount: 0.08 },
      { qty: 500, discount: 0.15 },
      { qty: 1000, discount: 0.22 },
      { qty: 2500, discount: 0.28 },
      { qty: 5000, discount: 0.35 }
    ]
  },
  'poly-mailer': {
    name: 'Custom Poly Mailer',
    baseUnit: 0.45,
    setup: 150,
    description: '12x15" poly mailer, 2-color print',
    volumeBreaks: [
      { qty: 500, discount: 0 },
      { qty: 1000, discount: 0.10 },
      { qty: 2500, discount: 0.18 },
      { qty: 5000, discount: 0.25 },
      { qty: 10000, discount: 0.32 },
      { qty: 25000, discount: 0.40 }
    ]
  },
  'corrugated-box': {
    name: 'Corrugated Shipping Box',
    baseUnit: 1.80,
    setup: 200,
    description: '12x10x6" brown corrugated, 1-color print',
    volumeBreaks: [
      { qty: 100, discount: 0 },
      { qty: 250, discount: 0.12 },
      { qty: 500, discount: 0.20 },
      { qty: 1000, discount: 0.28 },
      { qty: 2500, discount: 0.35 },
      { qty: 5000, discount: 0.42 },
      { qty: 10000, discount: 0.48 }
    ]
  },
  'folding-carton': {
    name: 'Folding Carton Box',
    baseUnit: 0.85,
    setup: 300,
    description: '6x4x2" SBS folding carton, 4-color print',
    volumeBreaks: [
      { qty: 250, discount: 0 },
      { qty: 500, discount: 0.10 },
      { qty: 1000, discount: 0.18 },
      { qty: 2500, discount: 0.25 },
      { qty: 5000, discount: 0.32 },
      { qty: 10000, discount: 0.40 }
    ]
  },
  'custom': {
    name: 'Custom Product',
    baseUnit: 2.50,
    setup: 250,
    description: 'Enter your own pricing',
    volumeBreaks: [
      { qty: 100, discount: 0 },
      { qty: 500, discount: 0.15 },
      { qty: 1000, discount: 0.25 },
      { qty: 5000, discount: 0.35 }
    ]
  }
};

export default function UnitCostCalculator() {
  useMarketingPageShell({ className: "space-y-0" });
  
  // Track page view
  usePageTracking({
    content_group1: 'Marketing',
    content_group2: 'Tools',
    content_group3: 'Unit Cost Calculator',
  });

  const [productType, setProductType] = useState<ProductType>('mailer-box');
  const [baseUnitCost, setBaseUnitCost] = useState(2.50);
  const [setupFee, setSetupFee] = useState(250);
  const [quantity, setQuantity] = useState(500);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeShipping, setIncludeShipping] = useState(true);
  const [shippingPerUnit, setShippingPerUnit] = useState(0.15);
  const [customFinishes, setCustomFinishes] = useState(false);
  const [finishCost, setFinishCost] = useState(0.25);

  const handleProductChange = (type: ProductType) => {
    setProductType(type);
    setBaseUnitCost(productPresets[type].baseUnit);
    setSetupFee(productPresets[type].setup);
    // Track product type change
    trackToolUsage('Unit Cost Calculator', 'product_type_change', { productType: type });
  };

  // Calculate costs at different quantities
  const calculations = useMemo(() => {
    const preset = productPresets[productType];
    const quantities = [100, 250, 500, 1000, 2500, 5000, 10000].filter(q =>
      q >= (preset.volumeBreaks[0]?.qty || 100)
    );

    return quantities.map(qty => {
      const applicableBreak = [...preset.volumeBreaks]
        .reverse()
        .find(vb => qty >= vb.qty);
      const discount = applicableBreak?.discount || 0;

      let unitCost = baseUnitCost * (1 - discount);
      if (customFinishes) unitCost += finishCost;
      if (includeShipping) unitCost += shippingPerUnit;

      const subtotal = unitCost * qty;
      const total = subtotal + setupFee;
      const effectiveUnitCost = total / qty;
      const savings = (baseUnitCost * qty + setupFee) - total;

      return {
        quantity: qty,
        unitCost: unitCost.toFixed(2),
        subtotal: subtotal.toFixed(2),
        setupFee: setupFee.toFixed(2),
        total: total.toFixed(2),
        effectiveUnitCost: effectiveUnitCost.toFixed(2),
        discount: (discount * 100).toFixed(0),
        savings: savings.toFixed(2)
      };
    });
  }, [productType, baseUnitCost, setupFee, includeShipping, shippingPerUnit, customFinishes, finishCost]);

  // Current quantity calculation
  const currentCalc = useMemo(() => {
    const preset = productPresets[productType];
    const applicableBreak = [...preset.volumeBreaks]
      .reverse()
      .find(vb => quantity >= vb.qty);
    const discount = applicableBreak?.discount || 0;

    let unitCost = baseUnitCost * (1 - discount);
    if (customFinishes) unitCost += finishCost;
    if (includeShipping) unitCost += shippingPerUnit;

    const subtotal = unitCost * quantity;
    const total = subtotal + setupFee;
    const effectiveUnitCost = total / quantity;
    const nextBreak = preset.volumeBreaks.find(vb => vb.qty > quantity);

    return {
      unitCost,
      subtotal,
      total,
      effectiveUnitCost,
      discount,
      nextBreak
    };
  }, [productType, baseUnitCost, setupFee, quantity, includeShipping, shippingPerUnit, customFinishes, finishCost]);

  // Track calculator usage when values change
  useEffect(() => {
    if (quantity > 0 && baseUnitCost > 0) {
      trackToolUsage('Unit Cost Calculator', 'calculation', {
        productType,
        quantity,
        baseUnitCost,
        setupFee,
        effectiveUnitCost: currentCalc.effectiveUnitCost.toFixed(2),
      });
    }
  }, [quantity, productType, baseUnitCost, setupFee, currentCalc.effectiveUnitCost]);

  const maxEffective = Math.max(...calculations.map(c => parseFloat(c.effectiveUnitCost)));

  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Custom Packaging Cost Calculator",
    "description": "Calculate the true cost of custom packaging at different order quantities. Understand setup fees, volume discounts, and per-unit pricing.",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <SEO
        title="Custom Packaging Cost Calculator | Unit Price & MOQ Calculator | HoleScale"
        description="Calculate the true cost of custom packaging at different quantities. Understand setup fees, volume discounts, and per-unit pricing for packaging and promotional products."
        canonical="https://www.holescale.com/tools/unit-cost-calculator"
        schema={[calculatorSchema]}
      />

      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Custom Packaging Cost Calculator
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Understand the true cost of custom packaging at different quantities.
              See how setup fees affect your per-unit cost and find your optimal order size.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 h-fit">
              <FadeIn>
                <h2 className="text-2xl font-bold mb-6">Configure Your Order</h2>

                {/* Product Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => handleProductChange(e.target.value as ProductType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    {Object.entries(productPresets).map(([key, preset]) => (
                      <option key={key} value={key}>{preset.name}</option>
                    ))}
                  </select>
                  <span className="block text-sm text-gray-500 mt-1.5">
                    {productPresets[productType].description}
                  </span>
                </div>

                {/* Base Unit Cost */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Unit Cost (before volume discounts)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <span className="px-4 py-3 bg-gray-100 text-gray-600">$</span>
                    <Input
                      type="number"
                      value={baseUnitCost}
                      onChange={(e) => setBaseUnitCost(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="border-0 rounded-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                {/* Setup Fee */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setup / Tooling Fee (one-time)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <span className="px-4 py-3 bg-gray-100 text-gray-600">$</span>
                    <Input
                      type="number"
                      value={setupFee}
                      onChange={(e) => setSetupFee(parseFloat(e.target.value) || 0)}
                      step="10"
                      min="0"
                      className="border-0 rounded-none focus-visible:ring-0"
                    />
                  </div>
                  <span className="block text-sm text-gray-500 mt-1.5">
                    Dies, plates, screens, or digital setup
                  </span>
                </div>

                {/* Quantity Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Quantity: <strong>{quantity.toLocaleString()}</strong>
                  </label>
                  <input
                    type="range"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min="50"
                    max="10000"
                    step="50"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50</span>
                    <span>10,000</span>
                  </div>
                </div>

                {/* Advanced Toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors mb-4"
                >
                  {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
                </button>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="p-5 bg-gray-50 rounded-lg space-y-4">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeShipping}
                          onChange={(e) => setIncludeShipping(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm">Include estimated shipping</span>
                      </label>
                      {includeShipping && (
                        <div className="ml-6 mt-2 flex items-center gap-2 text-sm">
                          <span>$</span>
                          <Input
                            type="number"
                            value={shippingPerUnit}
                            onChange={(e) => setShippingPerUnit(parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-20 h-8"
                          />
                          <span>per unit</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customFinishes}
                          onChange={(e) => setCustomFinishes(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm">Add premium finishes (foil, UV, etc.)</span>
                      </label>
                      {customFinishes && (
                        <div className="ml-6 mt-2 flex items-center gap-2 text-sm">
                          <span>$</span>
                          <Input
                            type="number"
                            value={finishCost}
                            onChange={(e) => setFinishCost(parseFloat(e.target.value) || 0)}
                            step="0.05"
                            className="w-20 h-8"
                          />
                          <span>per unit</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </FadeIn>
            </div>

            {/* Results Panel */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 rounded-2xl border border-gray-200">
              <FadeIn>
                <h2 className="text-2xl font-bold mb-6">Your Cost Breakdown</h2>

                {/* Main Result */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-xl text-center">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Total Investment
                    </span>
                    <span className="block text-3xl font-bold text-gray-900">
                      ${currentCalc.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-xl text-center">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Effective Unit Cost
                    </span>
                    <span className="block text-3xl font-bold text-green-600">
                      ${currentCalc.effectiveUnitCost.toFixed(2)}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      including setup fees
                    </span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white p-5 rounded-xl space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Base unit cost</span>
                    <span className="font-medium">${baseUnitCost.toFixed(2)}</span>
                  </div>
                  {currentCalc.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Volume discount ({(currentCalc.discount * 100).toFixed(0)}%)</span>
                      <span className="font-medium">-${(baseUnitCost * currentCalc.discount).toFixed(2)}</span>
                    </div>
                  )}
                  {customFinishes && (
                    <div className="flex justify-between">
                      <span>Premium finishes</span>
                      <span className="font-medium">+${finishCost.toFixed(2)}</span>
                    </div>
                  )}
                  {includeShipping && (
                    <div className="flex justify-between">
                      <span>Shipping (est.)</span>
                      <span className="font-medium">+${shippingPerUnit.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Unit cost after discounts</span>
                    <span>${currentCalc.unitCost.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-3" />
                  <div className="flex justify-between">
                    <span>Subtotal ({quantity.toLocaleString()} × ${currentCalc.unitCost.toFixed(2)})</span>
                    <span className="font-medium">${currentCalc.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>One-time setup fee</span>
                    <span className="font-medium">${setupFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t-2">
                    <span>Total</span>
                    <span>${currentCalc.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Next Price Break */}
                {currentCalc.nextBreak && (
                  <div className="mt-6 flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-gray-900 mb-1">
                        Next price break at {currentCalc.nextBreak.qty.toLocaleString()} units
                      </strong>
                      <p className="text-gray-600">
                        Order {(currentCalc.nextBreak.qty - quantity).toLocaleString()} more units to unlock{' '}
                        {(currentCalc.nextBreak.discount * 100).toFixed(0)}% volume discount
                      </p>
                    </div>
                  </div>
                )}
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Volume Pricing Comparison
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              See how your per-unit cost drops as order quantity increases
            </p>

            {/* Table */}
            <div className="overflow-x-auto mb-12">
              <div className="min-w-[640px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-4 py-4 text-left text-xs uppercase font-semibold tracking-wider">Quantity</th>
                      <th className="px-4 py-4 text-left text-xs uppercase font-semibold tracking-wider">Volume Discount</th>
                      <th className="px-4 py-4 text-left text-xs uppercase font-semibold tracking-wider">Unit Cost</th>
                      <th className="px-4 py-4 text-left text-xs uppercase font-semibold tracking-wider">Setup Fee</th>
                      <th className="px-4 py-4 text-left text-xs uppercase font-semibold tracking-wider">Total Cost</th>
                      <th className="px-4 py-4 text-left text-xs uppercase font-semibold tracking-wider">Effective $/Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.map((calc: Calculation, i: number) => (
                      <tr
                        key={calc.quantity}
                        className={`border-b ${
                          calc.quantity === quantity
                            ? 'bg-green-50'
                            : i % 2 === 0
                            ? 'bg-gray-50'
                            : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-4">
                          <strong>{calc.quantity.toLocaleString()}</strong>
                        </td>
                        <td className="px-4 py-4">
                          {parseInt(calc.discount) > 0 ? (
                            <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              -{calc.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">${calc.unitCost}</td>
                        <td className="px-4 py-4">${calc.setupFee}</td>
                        <td className="px-4 py-4">
                          <strong>${parseFloat(calc.total).toLocaleString()}</strong>
                        </td>
                        <td className="px-4 py-4 text-green-600 font-semibold">
                          ${calc.effectiveUnitCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 py-2 sm:hidden">
                <ArrowRight className="w-3 h-3" />
                <span>Scroll to see all columns</span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-center mb-8">
                Effective Unit Cost by Quantity
              </h3>
              <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
                <div className="flex justify-around items-end h-48 min-w-[400px] sm:min-w-[500px] md:min-w-0">
                  {calculations.map((calc) => {
                    const effectiveUnitCost = parseFloat(calc.effectiveUnitCost);
                    const height = (effectiveUnitCost / maxEffective) * 100;

                    return (
                      <div key={calc.quantity} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                        <div className="text-xs font-semibold text-gray-700">
                          ${calc.effectiveUnitCost}
                        </div>
                        <div
                          className={`w-full max-w-[40px] rounded-t transition-all ${
                            calc.quantity === quantity
                              ? 'bg-gradient-to-t from-green-600 to-green-500'
                              : 'bg-gradient-to-t from-purple-600 to-purple-500'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                        <div className="text-xs text-gray-600">
                          {calc.quantity >= 1000 ? `${calc.quantity / 1000}K` : calc.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                Lower bars = better value per unit
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2 sm:hidden">
                <ArrowRight className="w-3 h-3" />
                <span>Scroll to see all values</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Understanding Custom Packaging Costs
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">What's Included in Setup Fees?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Setup fees cover one-time costs like die creation (cutting shapes),
                  printing plates (for flexo/offset), screen setup (for apparel), or
                  digital file preparation. These fees are amortized across your order—
                  larger orders mean lower per-unit impact.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Digital vs. Offset Printing</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Digital printing has low/no setup fees but higher per-unit costs—ideal
                  for 50-500 units. Offset/flexo printing requires plates ($200-$500+)
                  but delivers much lower unit costs at volume. The crossover point is
                  typically 500-1,000 units.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Hidden Costs to Watch For</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ask suppliers about: tooling/die charges, plate fees, minimum run
                  charges, shipping estimates, and revision fees. A low per-unit quote
                  can hide $500+ in setup costs. Always request "landed cost" including
                  all fees and shipping.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">When to Order More</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If you'll reorder within 12 months, consider ordering at the next
                  price break. Storage cost is usually cheaper than paying higher
                  per-unit prices twice. Calculate: (extra units × unit cost) vs.
                  (reorder setup + higher unit cost later).
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Real Quotes?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Connect with vetted suppliers who offer transparent, all-inclusive pricing.
            </p>
            <Link to="/get-quotes">
              <Button size="lg" variant="secondary" className="font-semibold">
                Get Custom Quotes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
