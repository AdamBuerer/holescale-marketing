// Enhanced 3D Model Types with more shapes and controls

export type ModelType = 
  | 'box' 
  | 'cup' 
  | 'bag' 
  | 'bottle'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'pyramid'
  | 'torus'
  | 'capsule';

export interface ModelDimensions {
  width: number;
  height: number;
  depth: number;
}

export type MaterialTexture = 
  | 'none' 
  | 'wood' 
  | 'metal' 
  | 'fabric' 
  | 'leather' 
  | 'cardboard' 
  | 'glossy';

export interface ProductMaterial {
  color: string;
  texture: MaterialTexture;
  roughness: number;
  metalness: number;
}

export interface LogoPlacement {
  faces?: {
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
  arcRange?: {
    start: number;
    end: number;
  };
}

export interface LogoTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color?: string;
  placement: LogoPlacement;
}

export interface ThreeDConfig {
  modelType: ModelType;
  logoTransform: LogoTransform;
  productMaterial: ProductMaterial;
  dimensions: ModelDimensions;
  autoRotate: boolean;
  enableControls: boolean;
}

export const DEFAULT_PRODUCT_MATERIAL: ProductMaterial = {
  color: '#e5e7eb',
  texture: 'none',
  roughness: 0.6,
  metalness: 0.05,
};

export const DEFAULT_LOGO_PLACEMENT: LogoPlacement = {
  faces: {
    front: true,
    back: false,
    left: false,
    right: false,
    top: false,
    bottom: false,
  },
  arcRange: { start: 0, end: 90 },
};

export const DEFAULT_DIMENSIONS: Record<ModelType, ModelDimensions> = {
  box: { width: 1.2, height: 0.8, depth: 0.8 },
  cup: { width: 0.4, height: 1.3, depth: 0.4 },
  bag: { width: 1.0, height: 1.3, depth: 0.25 },
  bottle: { width: 0.35, height: 1.5, depth: 0.35 },
  sphere: { width: 0.8, height: 0.8, depth: 0.8 },
  cylinder: { width: 0.5, height: 1.2, depth: 0.5 },
  cone: { width: 0.6, height: 1.0, depth: 0.6 },
  pyramid: { width: 0.8, height: 1.0, depth: 0.8 },
  torus: { width: 0.6, height: 0.6, depth: 0.2 },
  capsule: { width: 0.4, height: 1.4, depth: 0.4 },
};
