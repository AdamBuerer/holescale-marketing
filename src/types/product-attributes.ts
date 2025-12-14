/**
 * Product Attributes Types
 * Structured attributes for spec-first search and filtering
 */

export type CategoryType = 
  | 'corrugated'
  | 'stretch'
  | 'bag'
  | 'rigid'
  | 'pallet'
  | 'other';

export type DimensionUnit = 'inches' | 'cm' | 'mm';
export type FluteType = 'B' | 'C' | 'E' | 'BC' | 'AB' | 'EB' | 'F' | 'N' | 'double-wall';
export type BoardColor = 'Kraft' | 'White' | 'Kraft/White' | 'Mottled White';
export type BoxStyle = 'RSC' | 'Mailer Box' | 'Gaylord' | 'OCTABIN' | 'Die-cut' | 'Shelf-ready';
export type HandVsMachineGrade = 'hand' | 'machine' | 'both';
export type BagType = 'flat' | 'gusseted' | 'reclosable' | 'wicketed' | 'box_liner';
export type ContainerMaterial = 'PET' | 'HDPE' | 'PP' | 'Glass' | 'Metal';
export type ClosureType = 'cap' | 'flip-top' | 'pump' | 'sprayer' | 'CRC' | 'tamper-evident';
export type PalletMaterial = 'wood' | 'plastic' | 'metal' | 'composite';
export type PalletGrade = 'A' | 'B' | 'C';

/**
 * Base product attributes interface
 */
export interface ProductAttributes {
  id: string;
  product_id: string;
  category_type: CategoryType;
  
  // Universal attributes
  dimension_length?: number | null;
  dimension_width?: number | null;
  dimension_height?: number | null;
  dimension_unit: DimensionUnit;
  material?: string | null;
  material_grade?: string | null;
  
  // Corrugated & Boxes
  ect_value?: number | null;
  mullen_value?: number | null;
  flute_type?: FluteType | null;
  board_color?: BoardColor | null;
  box_style?: BoxStyle | null;
  
  // Stretch & Shrink
  gauge?: number | null;
  roll_width?: number | null;
  roll_length?: number | null;
  roll_length_unit?: 'feet' | 'meters' | null;
  hand_vs_machine_grade?: HandVsMachineGrade | null;
  pre_stretch_percent?: number | null;
  
  // Bags & Liners
  thickness_mil?: number | null;
  bag_type?: BagType | null;
  food_safe: boolean;
  anti_static: boolean;
  
  // Rigid Containers & Closures
  container_material?: ContainerMaterial | null;
  volume_oz?: number | null;
  volume_ml?: number | null;
  volume_l?: number | null;
  neck_finish?: string | null; // e.g., "28-410"
  closure_type?: ClosureType | null;
  
  // Pallets & Transport
  pallet_material?: PalletMaterial | null;
  pallet_size?: string | null; // e.g., "40x48"
  load_capacity_lbs?: number | null;
  pallet_grade?: PalletGrade | null;
  
  created_at: string;
  updated_at: string;
}

/**
 * Parsed spec attributes from natural language search
 */
export interface ParsedSpecAttributes {
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: DimensionUnit;
  };
  material?: string;
  ect?: number;
  mullen?: number;
  gauge?: number;
  neck_finish?: string;
  flute_type?: FluteType;
  box_style?: BoxStyle;
  bag_type?: BagType;
  closure_type?: ClosureType;
  // Add more as needed
}

/**
 * Category-specific attribute filters
 */
export interface CorrugatedFilters {
  dimensions?: {
    length?: { min?: number; max?: number };
    width?: { min?: number; max?: number };
    height?: { min?: number; max?: number };
  };
  ect?: { min?: number; max?: number };
  mullen?: { min?: number; max?: number };
  flute_type?: FluteType[];
  board_color?: BoardColor[];
  box_style?: BoxStyle[];
}

export interface StretchFilters {
  gauge?: { min?: number; max?: number };
  roll_width?: { min?: number; max?: number };
  roll_length?: { min?: number; max?: number };
  hand_vs_machine_grade?: HandVsMachineGrade[];
}

export interface BagFilters {
  thickness_mil?: { min?: number; max?: number };
  bag_type?: BagType[];
  food_safe?: boolean;
  anti_static?: boolean;
}

export interface RigidFilters {
  container_material?: ContainerMaterial[];
  volume_oz?: { min?: number; max?: number };
  volume_ml?: { min?: number; max?: number };
  neck_finish?: string[];
  closure_type?: ClosureType[];
}

export interface PalletFilters {
  pallet_material?: PalletMaterial[];
  pallet_size?: string[];
  load_capacity_lbs?: { min?: number; max?: number };
  pallet_grade?: PalletGrade[];
}
