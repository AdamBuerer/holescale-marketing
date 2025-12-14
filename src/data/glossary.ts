/**
 * Packaging Glossary
 * Terms and definitions for inline tooltips
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'corrugated' | 'flexible' | 'rigid' | 'logistics' | 'general';
  aliases?: string[]; // Alternative names/spellings
  example?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Corrugated
  {
    term: 'ECT',
    definition: 'Edge Crush Test - measures the compression strength of corrugated board. Higher ECT = stronger box. Common values: 32 ECT (standard), 44 ECT (heavy-duty).',
    category: 'corrugated',
    aliases: ['Edge Crush Test', 'edge crush'],
    example: '32 ECT box can handle 65 lbs, 44 ECT can handle 80 lbs',
  },
  {
    term: 'Mullen',
    definition: 'Mullen Burst Test - measures the bursting strength of corrugated board. Expressed in pounds per square inch (PSI). Alternative to ECT.',
    category: 'corrugated',
    aliases: ['Burst Test', 'Mullen Test'],
    example: '200# Mullen = 200 pounds per square inch burst strength',
  },
  {
    term: 'Flute',
    definition: 'The wavy layer between two flat liners in corrugated board. Flute types: B (1/8"), C (3/16"), E (1/16"), F (micro). Double-wall uses combinations like BC.',
    category: 'corrugated',
    aliases: ['Flute Type'],
    example: 'B-flute: good cushioning, C-flute: balanced strength, E-flute: thin and smooth',
  },
  {
    term: 'RSC',
    definition: 'Regular Slotted Container - the most common box style. All flaps are the same length, meeting in the center when closed.',
    category: 'corrugated',
    aliases: ['Regular Slotted Container'],
  },
  {
    term: '28-410',
    definition: 'Neck finish specification for bottles/jars. First number (28) = thread diameter in mm, second number (410) = thread pitch. Common finishes: 24-410, 28-400, 28-410, 33-400.',
    category: 'rigid',
    aliases: ['neck finish', 'thread finish'],
    example: '28-410 means 28mm diameter with 410 thread pitch',
  },
  {
    term: 'Gauge',
    definition: 'Thickness measurement for stretch wrap and films, measured in mils (thousandths of an inch). Higher gauge = thicker = more protection. Common: 60, 80, 90, 100 gauge.',
    category: 'flexible',
    aliases: ['mil', 'thickness'],
    example: '80 gauge stretch wrap is standard for machine-grade applications',
  },
  {
    term: 'MOQ',
    definition: 'Minimum Order Quantity - the smallest number of units a supplier will produce or sell. Higher MOQs often mean lower per-unit prices.',
    category: 'general',
    aliases: ['Minimum Order', 'min order'],
  },
  {
    term: 'OTIF',
    definition: 'On-Time In-Full - percentage of orders delivered on the promised date with the correct quantity. Key metric for supplier reliability.',
    category: 'logistics',
    aliases: ['On-Time In-Full'],
  },
  {
    term: 'LTL',
    definition: 'Less Than Truckload - freight shipping for loads that don\'t fill an entire truck. More economical than FTL for smaller shipments.',
    category: 'logistics',
    aliases: ['Less Than Truckload'],
  },
  {
    term: 'FTL',
    definition: 'Full Truckload - freight shipping for loads that fill an entire truck. Most economical for large shipments.',
    category: 'logistics',
    aliases: ['Full Truckload'],
  },
  {
    term: 'Kraft',
    definition: 'Brown paper/cardboard made from wood pulp. Natural, unbleached appearance. Most common and cost-effective material for corrugated boxes.',
    category: 'corrugated',
    aliases: ['Kraft paper', 'brown cardboard'],
  },
  {
    term: 'Food-Safe',
    definition: 'Packaging that meets FDA requirements for direct food contact. Must be made from approved materials and manufactured in certified facilities.',
    category: 'general',
    aliases: ['FDA-compliant', 'food-grade', 'food contact'],
  },
  {
    term: 'FSC',
    definition: 'Forest Stewardship Council - certification for sustainably sourced paper/wood products. Ensures responsible forest management.',
    category: 'general',
    aliases: ['FSC Certified'],
  },
  {
    term: 'Recycled Content',
    definition: 'Percentage of material made from recycled materials. Post-consumer recycled (PCR) comes from consumer waste; post-industrial recycled (PIR) comes from manufacturing scraps.',
    category: 'general',
    aliases: ['PCR', 'PIR', 'recycled'],
  },
];

/**
 * Find glossary term by text (case-insensitive, supports aliases)
 */
export function findGlossaryTerm(text: string): GlossaryTerm | null {
  const normalized = text.toLowerCase().trim();
  
  return GLOSSARY_TERMS.find((term) => {
    if (term.term.toLowerCase() === normalized) return true;
    if (term.aliases?.some((alias) => alias.toLowerCase() === normalized)) return true;
    // Partial match for terms like "32 ECT" -> matches "ECT"
    if (normalized.includes(term.term.toLowerCase())) return true;
    return false;
  }) || null;
}

/**
 * Get all terms by category
 */
export function getTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((term) => term.category === category);
}

/**
 * Search glossary terms
 */
export function searchGlossaryTerms(query: string): GlossaryTerm[] {
  const normalized = query.toLowerCase();
  return GLOSSARY_TERMS.filter((term) => {
    return (
      term.term.toLowerCase().includes(normalized) ||
      term.definition.toLowerCase().includes(normalized) ||
      term.aliases?.some((alias) => alias.toLowerCase().includes(normalized))
    );
  });
}
