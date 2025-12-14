/**
 * TypeScript types for RFQ Mockup Workflow
 * 
 * Shared types for buyer logos, design mockups, and related entities
 */

export interface BuyerLogo {
  id: string;
  buyer_id: string;
  logo_name: string;
  logo_url: string;
  has_transparent_bg: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesignMockup {
  id: string;
  buyer_id: string;
  product_id: string | null;
  rfq_id: string | null;
  logo_id: string | null;
  logo_url: string | null;
  preview_3d_url: string | null;
  realistic_url: string | null;
  canva_design_id: string | null;
  canva_design_url: string | null;
  canva_export_url: string | null;
  is_attached_to_rfq: boolean;
  attached_rfq_id: string | null;
  design_metadata: {
    created_via?: string;
    product_name?: string;
    logo_url?: string;
    template_id?: string;
    [key: string]: any;
  } | null;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
  } | null;
}

export interface RFQWithMockup {
  id: string;
  buyer_id: string;
  title: string;
  product_name: string | null;
  quantity: number;
  mockup_id: string | null;
  mockup_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  mockup?: DesignMockup | null;
}

