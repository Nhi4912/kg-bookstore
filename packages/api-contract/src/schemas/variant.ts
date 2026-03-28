import { z } from "zod/v4";
import { imageRequestSchema } from "./common";
import { attributeValueInputSchema } from "./product";

// ─── Create Variant ───

export const createVariantRequestSchema = z.object({
  attribute_values: z.array(attributeValueInputSchema).optional(),
  cost_price: z.number().int().optional(),
  retail_price: z.number().int().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock_quantity: z.number().int().optional(),
  image: imageRequestSchema.nullable().optional(),
});

// ─── Update Variant ───

export const updateVariantRequestSchema = z.object({
  attribute_values: z.array(attributeValueInputSchema).optional(),
  cost_price: z.number().int().optional(),
  retail_price: z.number().int().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock_quantity: z.number().int().optional(),
  image: imageRequestSchema.nullable().optional(),
  is_update_image: z.boolean().optional(),
});
