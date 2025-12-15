import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, AlertTriangle, X } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/ui/FadeIn';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";

type ItemType = 'promo' | 'gift' | 'entertainment';
type Recipients = 'general' | 'clients' | 'employees';

interface Item {
  id: number;
  name: string;
  unitCost: number;
  quantity: number;
  type: ItemType;
  branded: boolean;
  recipients: Recipients;
}

interface NewItem {
  name: string;
  unitCost: string;
  quantity: string;
  type: ItemType;
  branded: boolean;
  recipients: Recipients;
}

interface ItemCalculation extends Item {
  itemTotal: number;
  deductible: number;
  nonDeductible: number;
  classification: string;
  reason: string;
}

interface Preset {
  name: string;
  unitCost: number;
  type: ItemType;
  branded: boolean;
}

const presets: Preset[] = [
  { name: 'Branded Pens', unitCost: 1.50, type: 'promo', branded: true },
  { name: 'Custom T-Shirts', unitCost: 12.00, type: 'promo', branded: true },
  { name: 'Branded Tote Bags', unitCost: 8.00, type: 'promo', branded: true },
  { name: 'Premium Gift Box', unitCost: 75.00, type: 'gift', branded: false },
  { name: 'Wine/Champagne', unitCost: 45.00, type: 'gift', branded: false },
  { name: 'Holiday Gift Basket', unitCost: 85.00, type: 'gift', branded: false },
  { name: 'Event Tickets', unitCost: 150.00, type: 'entertainment', branded: false },
  { name: 'Custom Mugs', unitCost: 5.00, type: 'promo', branded: true },
  { name: 'Desk Accessories', unitCost: 22.00, type: 'gift', branded: false },
  { name: 'Tech Accessories', unitCost: 18.00, type: 'promo', branded: true }
];

export default function TaxCalculator() {
  useMarketingPageShell({ className: "space-y-0" });

  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Custom Notebook', unitCost: 12.50, quantity: 100, type: 'gift', branded: false, recipients: 'clients' },
    { id: 2, name: 'Branded Pens', unitCost: 1.25, quantity: 500, type: 'promo', branded: true, recipients: 'general' }
  ]);

  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    unitCost: '',
    quantity: '',
    type: 'promo',
    branded: true,
    recipients: 'general'
  });

  const [showEducation, setShowEducation] = useState(true);

  const addItem = () => {
    if (!newItem.name || !newItem.unitCost || !newItem.quantity) return;

    setItems([...items, {
      id: Date.now(),
      name: newItem.name,
      unitCost: parseFloat(newItem.unitCost),
      quantity: parseInt(newItem.quantity),
      type: newItem.type,
      branded: newItem.branded,
      recipients: newItem.recipients
    }]);

    setNewItem({
      name: '',
      unitCost: '',
      quantity: '',
      type: 'promo',
      branded: true,
      recipients: 'general'
    });
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const applyPreset = (preset: Preset) => {
    setNewItem({
      ...newItem,
      name: preset.name,
      unitCost: preset.unitCost.toString(),
      type: preset.type,
      branded: preset.branded
    });
  };

  const calculations = useMemo(() => {
    let totalSpend = 0;
    let totalDeductible = 0;
    let totalNonDeductible = 0;

    const itemBreakdown = items.map(item => {
      const itemTotal = item.unitCost * item.quantity;
      totalSpend += itemTotal;

      let deductible = 0;
      let nonDeductible = 0;
      let reason = '';
      let classification = '';

      if (item.type === 'promo' && item.branded) {
        deductible = itemTotal;
        classification = 'Promotional (Advertising)';
        reason = 'Branded promotional items distributed widely are deductible as advertising expenses with no per-person limit.';
      } else if (item.type === 'gift') {
        if (item.unitCost <= 25) {
          deductible = itemTotal;
          classification = 'Business Gift (Under $25)';
          reason = 'Business gifts under $25 per recipient per year are fully deductible.';
        } else {
          deductible = 25 * item.quantity;
          nonDeductible = itemTotal - deductible;
          classification = 'Business Gift (Over $25)';
          reason = `Only $25 per recipient is deductible. ${(item.unitCost - 25).toFixed(2)} × ${item.quantity} = $${nonDeductible.toFixed(2)} not deductible.`;
        }
      } else if (item.type === 'entertainment') {
        nonDeductible = itemTotal;
        classification = 'Entertainment';
        reason = 'Entertainment expenses are generally not deductible under current tax law.';
      } else {
        if (item.unitCost <= 25) {
          deductible = itemTotal;
          classification = 'Non-Branded Item (Gift)';
          reason = 'Non-branded items given as gifts are subject to the $25/person limit but qualify under it.';
        } else {
          deductible = 25 * item.quantity;
          nonDeductible = itemTotal - deductible;
          classification = 'Non-Branded Item (Over $25)';
          reason = 'Non-branded items over $25 are treated as gifts with partial deductibility.';
        }
      }

      totalDeductible += deductible;
      totalNonDeductible += nonDeductible;

      return {
        ...item,
        itemTotal,
        deductible,
        nonDeductible,
        classification,
        reason
      };
    });

    const estimatedTaxRate = 0.25;
    const estimatedSavings = totalDeductible * estimatedTaxRate;

    return {
      items: itemBreakdown,
      totalSpend,
      totalDeductible,
      totalNonDeductible,
      deductionRate: totalSpend > 0 ? (totalDeductible / totalSpend * 100).toFixed(1) : '0',
      estimatedSavings
    };
  }, [items]);

  const faqs = [
    {
      q: "What is the IRS limit for business gifts in 2025?",
      a: "The IRS business gift deduction limit is $25 per recipient per year. This limit has remained unchanged for decades. Amounts spent over $25 per person are not deductible, though incidental costs like gift wrapping don't count toward the limit."
    },
    {
      q: "Are promotional products tax deductible?",
      a: "Yes, promotional products (items with your company logo distributed to promote your business) are generally fully deductible as advertising expenses. Unlike business gifts, there's no per-person dollar limit for promotional items."
    },
    {
      q: "Can I deduct branded swag given at trade shows?",
      a: "Yes, branded items distributed at trade shows typically qualify as advertising expenses, not business gifts. This means no $25 per-person limit applies. The items should have your company branding and be distributed broadly to promote your business."
    },
    {
      q: "Are client entertainment expenses deductible?",
      a: "Generally no. Under current tax law (post-2017 Tax Cuts and Jobs Act), entertainment expenses like sporting event tickets, concerts, and similar activities are not deductible, even if business is discussed."
    },
    {
      q: "What's the difference between a gift and a promotional item?",
      a: "A business gift is given to a specific individual to maintain goodwill (subject to $25 limit). A promotional item has your company branding and is distributed broadly to advertise your business (no dollar limit, treated as advertising expense)."
    },
    {
      q: "Can I deduct gifts to employees?",
      a: "Employee gifts are generally treated as taxable compensation, not deductible business gifts. However, small 'de minimis' benefits (occasional snacks, holiday turkeys, etc.) may be excluded from employee income. Cash and gift cards are always taxable."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.slice(0, 2).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO
        title="Business Gift Tax Calculator | Promotional Products Deduction Guide | HoleScale"
        description="Calculate which corporate gifts and promotional products qualify for tax deductions. Understand IRS rules, the $25 business gift limit, and optimize your swag budget."
        canonical="https://www.holescale.com/tools/tax-calculator"
        schema={[faqSchema]}
      />

      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Business Gift & Promo Tax Calculator
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
              Understand which corporate gifts and promotional products qualify for tax deductions.
              Calculate your potential savings and optimize your swag budget.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm text-amber-100">
              <AlertTriangle className="w-4 h-4" />
              <span>
                This calculator is for educational purposes only. Tax rules vary by situation.
                Consult a qualified tax professional for advice specific to your business.
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick Rules Summary */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              IRS Rules at a Glance
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-7 rounded-2xl border border-gray-200 text-center">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="text-xl font-semibold mb-2">Business Gifts</h3>
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-3">
                  $25 limit
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Per recipient, per year. Amounts over $25 are not deductible.
                  Incidental costs (engraving, wrapping) don't count toward the limit.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border-2 border-green-500 shadow-lg text-center">
                <div className="text-4xl mb-3">📣</div>
                <h3 className="text-xl font-semibold mb-2">Promotional Items</h3>
                <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-3">
                  No limit
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Branded items (your logo) distributed widely to promote your business
                  are deductible as advertising expenses—no per-person cap.
                </p>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-gray-200 text-center">
                <div className="text-4xl mb-3">🎫</div>
                <h3 className="text-xl font-semibold mb-2">Entertainment</h3>
                <div className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-3">
                  Not deductible
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Event tickets, sporting events, concerts, and similar entertainment
                  expenses are generally not deductible under current law.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Calculate Your Deductions
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-semibold mb-6">Add Items</h3>

                {/* Quick Presets */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Add:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {presets.slice(0, 5).map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Item Name
                    </label>
                    <Input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Custom Notebooks"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Unit Cost
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <span className="px-3 py-2.5 bg-gray-100 text-gray-600">$</span>
                        <Input
                          type="number"
                          value={newItem.unitCost}
                          onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                          placeholder="0.00"
                          step="0.01"
                          className="border-0 rounded-none focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={newItem.type}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value as ItemType })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      >
                        <option value="promo">Promotional Item</option>
                        <option value="gift">Business Gift</option>
                        <option value="entertainment">Entertainment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Branded?
                      </label>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setNewItem({ ...newItem, branded: true })}
                          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${
                            newItem.branded
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Yes (Logo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewItem({ ...newItem, branded: false })}
                          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${
                            !newItem.branded
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={addItem}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    + Add Item
                  </Button>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4">
                      Your Items ({items.length})
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {calculations.items.map((item: ItemCalculation) => (
                        <div key={item.id} className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <strong className="block text-sm">{item.name}</strong>
                              <span className="text-xs text-gray-600">
                                {item.quantity} × ${item.unitCost.toFixed(2)} = ${item.itemTotal.toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mb-2">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                item.type === 'promo'
                                  ? 'bg-green-100 text-green-700'
                                  : item.type === 'entertainment'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.classification}
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm mb-2">
                            <span className="text-green-600 font-medium">
                              ${item.deductible.toFixed(2)} deductible
                            </span>
                            {item.nonDeductible > 0 && (
                              <span className="text-red-600">
                                ${item.nonDeductible.toFixed(2)} not deductible
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-semibold mb-6">Deduction Summary</h3>

                {/* Main Results */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-xl text-center">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Total Spend
                    </span>
                    <span className="block text-2xl font-bold">${calculations.totalSpend.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 bg-white p-5 rounded-xl text-center">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Total Deductible
                    </span>
                    <span className="block text-4xl font-bold text-green-600 mb-1">
                      ${calculations.totalDeductible.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600">
                      {calculations.deductionRate}% of spend
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-xl text-center">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Non-Deductible
                    </span>
                    <span className="block text-2xl font-bold text-red-600">
                      ${calculations.totalNonDeductible.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-xl text-center">
                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Est. Tax Savings*
                    </span>
                    <span className="block text-2xl font-bold">${calculations.estimatedSavings.toFixed(2)}</span>
                    <span className="block text-xs text-gray-400 mt-1">*Assumes 25% effective rate</span>
                  </div>
                </div>

                {/* Optimization Tips */}
                {calculations.totalNonDeductible > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl mb-6">
                    <div className="flex items-start gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <h4 className="font-semibold text-gray-900">Optimization Tips</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {calculations.items.some((i: ItemCalculation) => i.type === 'gift' && i.unitCost > 25) && (
                        <li>
                          <strong>Brand those gifts:</strong> If you add your logo to gift items
                          and distribute them more broadly, they may qualify as promotional items
                          with no $ limit.
                        </li>
                      )}
                      {calculations.items.some((i: ItemCalculation) => i.type === 'entertainment') && (
                        <li>
                          <strong>Skip entertainment:</strong> Event tickets and entertainment
                          aren't deductible. Consider branded swag bags or promotional gifts instead.
                        </li>
                      )}
                      {calculations.items.some((i: ItemCalculation) => i.type === 'gift' && i.unitCost > 25 && i.unitCost <= 30) && (
                        <li>
                          <strong>Stay under $25:</strong> Some gifts are just over the $25 limit.
                          Finding a similar item under $25 makes the full amount deductible.
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Breakdown Chart */}
                {calculations.totalSpend > 0 && (
                  <div className="bg-white p-5 rounded-xl">
                    <h4 className="text-sm font-semibold text-center mb-4">Deduction Breakdown</h4>
                    <div className="flex h-6 rounded-xl overflow-hidden mb-3">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-500"
                        style={{ width: `${calculations.deductionRate}%` }}
                      />
                      <div
                        className="bg-red-100"
                        style={{ width: `${100 - parseFloat(calculations.deductionRate)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600">
                        Deductible: ${calculations.totalDeductible.toFixed(2)}
                      </span>
                      <span className="text-red-600">
                        Non-Deductible: ${calculations.totalNonDeductible.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Tax Rules Explained</h2>
              <button
                onClick={() => setShowEducation(!showEducation)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-sm font-medium transition-colors"
              >
                {showEducation ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {showEducation && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">The $25 Business Gift Rule</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Under IRS rules, you can deduct up to <strong>$25 per recipient per year</strong> for
                    business gifts. If you give a $50 gift, only $25 is deductible.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <strong>What counts as incidental?</strong> Engraving, gift wrapping, and packaging
                    don't count toward the $25 limit as long as they don't add substantial value.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Promotional Items vs. Gifts</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    The key distinction: <strong>Promotional items</strong> have your company name/logo
                    and are distributed widely. These are advertising expenses with <strong>no dollar limit</strong>.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A $50 branded jacket at a trade show? Advertising expense, fully deductible.
                    Same jacket without branding? Business gift, $25 limit applies.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">What About Employee Gifts?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Gifts to employees are generally treated as <strong>taxable compensation</strong>,
                    not business gifts. However, "de minimis" fringe benefits may be excluded.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cash and gift cards are <strong>always taxable</strong> to employees, regardless of amount.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Documentation Requirements</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Keep records of: recipient name, business relationship, date, description,
                    cost, and business purpose.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Without proper documentation, you may lose the deduction entirely if audited.
                  </p>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help Sourcing Tax-Deductible Promo Products?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Get quotes on branded promotional items that maximize your deduction potential.
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
