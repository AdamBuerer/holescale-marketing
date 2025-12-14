export type ProductCategory =
  | 'corrugated-boxes'
  | 'mailers-envelopes'
  | 'poly-bags'
  | 'food-packaging'
  | 'protective-packaging'
  | 'labels-tags'
  | 'shipping-supplies'
  | 'sustainable-packaging'
  | 'retail-packaging'
  | 'industrial-packaging'
  | 'paper-paperboard'
  | 'rigid-plastics'
  | 'films-wraps'
  | 'packaging-accessories';

export type DecorationType =
  | 'digital-print'     // For full-color designs on packaging
  | 'flexographic'      // For high-volume packaging printing
  | 'offset-print'      // For premium packaging printing
  | 'direct-print'      // For packaging, boxes
  | 'screen-print'      // For bags, labels
  | 'embossing'         // For premium packaging
  | 'foil-stamping'     // For luxury packaging
  | 'label-application' // For labels and stickers
  | 'custom-die-cut';   // For custom shapes

export interface DecorationMethod {
  type: DecorationType;
  name: string;
  description: string;
  minQuantity: number;
  setupFee: number;
  colorRestrictions?: {
    maxColors?: number;      // e.g., 2 colors for screen print
    type: 'single' | 'multi' | 'full-color';
  };
  sizeRestrictions?: {
    maxWidth: number;         // inches
    maxHeight: number;        // inches
  };
  pricePerUnit: number;       // Base price for this method
}

export interface ColorOption {
  id: string;
  name: string;               // e.g., "Black", "Navy Blue"
  hexCode: string;            // e.g., "#000000"
  available: boolean;
  imageUrl?: string;          // Optional: image of product in this color
}

export interface LogoPlacementArea {
  id: string;
  name: string;               // e.g., "Chest Left", "Full Front", "Back"
  
  // Position on 2D dieline (percentage)
  dieline: {
    x: number;                // 0-100
    y: number;                // 0-100
    width: number;            // 0-100
    height: number;           // 0-100
    rotation?: number;        // degrees
  };
  
  // Position on 3D mockup (percentage)
  mockup: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    perspective?: {           // For realistic 3D mapping
      skewX?: number;
      skewY?: number;
      scale?: number;
    };
  };
  
  // Constraints
  maxWidth: number;           // Max logo width in inches
  maxHeight: number;          // Max logo height in inches
  recommendedSize: string;    // e.g., "3\" × 3\""
  
  allowedDecorations: DecorationType[];
}

export interface MockupProduct {
  id: string;
  name: string;
  description: string;
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
  
  category: ProductCategory;
  subcategory?: string;       // e.g., "T-Shirt", "Baseball Cap"
  
  // Physical dimensions
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit: 'inches' | 'cm';
  };
  
  // Available colors
  colors: ColorOption[];
  defaultColorId: string;
  
  // Decoration methods available for this product
  decorationMethods: DecorationMethod[];
  defaultDecorationMethod: DecorationType;
  
  // Logo placement areas
  logoPlacementAreas: LogoPlacementArea[];
  defaultPlacementAreaId: string;
  
  // Images
  images: {
    thumbnail: string;        // Product card image
    dieline?: string;         // 2D flat template (for packaging)
    mockupsByColor: {
      [colorId: string]: {
        front: string;        // Front view mockup
        back?: string;        // Back view mockup (optional)
        side?: string;        // Side view mockup (optional)
        angled?: string;      // 3/4 view mockup (optional)
      };
    };
  };
  
  // Pricing
  pricing: {
    basePrice: number;        // Price without decoration
    moq: number;              // Minimum order quantity
    priceBreaks?: Array<{
      quantity: number;
      pricePerUnit: number;
    }>;
  };
  
  // Additional info
  material?: string;          // e.g., "100% Cotton", "Cardboard"
  weight?: string;
  leadTime?: string;          // e.g., "5-7 business days"
  tags?: string[];            // For search/filtering
  
  featured?: boolean;
  available: boolean;
  
  createdAt?: string;
  updatedAt?: string;
}

// Logo state interface for interactive editing
export interface LogoState {
  imageUrl: string;
  position: {
    x: number;                // Pixels from left
    y: number;                // Pixels from top
  };
  size: {
    width: number;            // Pixels
    height: number;           // Pixels
  };
  rotation: number;           // Degrees
  opacity?: number;           // 0-1
}
