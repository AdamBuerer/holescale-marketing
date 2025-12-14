import { z } from "zod";

/**
 * Waitlist form validation schema
 * Ensures all inputs are sanitized and validated before submission
 */
export const waitlistFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),

  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes",
    })
    .optional()
    .or(z.literal("")),

  company: z
    .string()
    .trim()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(150, { message: "Company name must be less than 150 characters" }),

  role: z.enum(["buyer", "supplier", "both"], {
    message: "Please select a valid role",
  }),

  // Optional buyer-specific fields
  productCategory: z
    .string()
    .trim()
    .max(100, { message: "Product category must be less than 100 characters" })
    .optional()
    .or(z.literal("")),

  orderVolume: z
    .string()
    .trim()
    .max(100, { message: "Order volume must be less than 100 characters" })
    .optional()
    .or(z.literal("")),

  // Optional supplier-specific fields
  supplierCategories: z
    .string()
    .trim()
    .max(200, { message: "Supplier categories must be less than 200 characters" })
    .optional()
    .or(z.literal("")),

  annualRevenue: z
    .string()
    .trim()
    .max(50, { message: "Annual revenue must be less than 50 characters" })
    .optional()
    .or(z.literal("")),

  // New fields from redesign
  companySize: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+"], {
      message: "Please select a company size",
    })
    .optional()
    .or(z.literal("")),

  primaryInterest: z
    .enum(["corrugated", "mailers", "flexible", "food", "labels", "sustainable", "multiple"], {
      message: "Please select a primary interest",
    })
    .optional()
    .or(z.literal("")),

  referralSource: z
    .enum(["Google", "LinkedIn", "Referral", "Event", "Other"], {
      message: "Please select how you heard about us",
    })
    .optional()
    .or(z.literal("")),
});

export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
