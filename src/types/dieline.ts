/**
 * Type definitions for the 3D-to-dieline system
 */

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Face {
  vertices: Point3D[];
  normal?: Point3D;
  id?: string;
}

export interface Edge {
  start: Point3D;
  end: Point3D;
  faceIds?: string[];
  isFold?: boolean;
}

export interface DielinePath {
  points: Point2D[];
  type: 'cut' | 'fold' | 'perforation';
  closed?: boolean;
}

export interface DielineTemplate {
  id: string;
  name: string;
  description?: string;
  dimensions: {
    width: number;  // in inches
    height: number; // in inches
    depth?: number; // in inches (for 3D preview)
  };
  paths: DielinePath[];
  metadata?: {
    sourceModel?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
  };
}

export interface Parsed3DModel {
  faces: Face[];
  edges: Edge[];
  vertices: Point3D[];
  boundingBox: {
    min: Point3D;
    max: Point3D;
    center: Point3D;
  };
}

export interface UnfoldedPattern {
  panels: Panel[];
  foldLines: FoldLine[];
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Panel {
  id: string;
  vertices: Point2D[];
  faceId?: string;
  label?: string;
}

export interface FoldLine {
  start: Point2D;
  end: Point2D;
  type: 'mountain' | 'valley';
  faceIds?: string[];
}

export interface ModelUploadResult {
  success: boolean;
  template?: DielineTemplate;
  error?: string;
  processingTime?: number;
}

