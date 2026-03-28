import { z } from "zod/v4";
import {
  imageRequestSchema,
  imageResponseSchema,
  pagingResponseSchema,
} from "./common";

// ─── Vendor / Category ───

export const vendorResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Attribute Value ───

export const attributeValueResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  value: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const attributeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const attributeListResponseSchema = z.object({
  items: z.array(attributeResponseSchema),
});

export const categoryListResponseSchema = z.object({
  items: z.array(categoryResponseSchema),
});

// ─── Variant ───

export const variantResponseSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  image_id: z.string().nullable().optional(),
  image: imageResponseSchema.nullable().optional(),
  attributes: z.array(attributeValueResponseSchema),
  barcode: z.string(),
  sku: z.string(),
  retail_price: z.number().int(),
  cost_price: z.number().int(),
  stock_quantity: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Product Collection Path ───

export const productCollectionPathSchema = z.object({
  collection_id: z.string(),
  path: z.array(z.string()),
});

// ─── Product Response ───

export const productResponseSchema = z.object({
  id: z.string(),
  vendor_id: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  vendor: vendorResponseSchema.nullable().optional(),
  category: categoryResponseSchema.nullable().optional(),
  images: z.array(imageResponseSchema).nullable().optional(),
  variants: z.array(variantResponseSchema).optional(),
  collection_ids: z.array(z.string()),
  product_collection_paths: z
    .array(productCollectionPathSchema)
    .optional(),
  size_guide: z.string().optional(),
  name: z.string(),
  description: z.string(),
  quote: z.string(),
  type: z.number().int(),
  sequence_number: z.number().int().optional(),
  is_visible: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const productListResponseSchema = z.object({
  items: z.array(productResponseSchema),
  paging: pagingResponseSchema,
});

// ─── Attribute Value Input ───

export const attributeValueInputSchema = z.object({
  attribute_id: z.string(),
  value: z.string(),
});

// ─── Create / Update Product ───

export const createProductRequestSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  category_id: z.string().min(1, "Loại sản phẩm không được để trống"),
  vendor_id: z.string().nullable().optional(),
  collection_ids: z.array(z.string()).optional(),
  images: z.array(imageRequestSchema).optional(),
  variants: z
    .array(
      z.object({
        attribute_values: z.array(attributeValueInputSchema).optional(),
        cost_price: z.number().int().optional(),
        retail_price: z.number().int().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        stock_quantity: z.number().int().optional(),
        image: imageRequestSchema.nullable().optional(),
      }),
    )
    .optional(),
  description: z.string().optional(),
  quote: z.string().optional(),
  type: z.number().int().optional(),
  is_visible: z.boolean().optional(),
});

export const updateProductRequestSchema = z.object({
  name: z.string().optional(),
  category_id: z.string().nullable().optional(),
  vendor_id: z.string().nullable().optional(),
  collection_ids: z.array(z.string()).optional(),
  is_update_images: z.boolean().optional(),
  images: z.array(imageRequestSchema).optional(),
  description: z.string().optional(),
  quote: z.string().optional(),
  type: z.number().int().optional(),
  is_visible: z.boolean().optional(),
});

// ─── Product Query Params ───

export const productQueryParamsSchema = z.object({
  limit: z.number().int().default(20),
  offset: z.number().int().default(0),
  sort_by: z.string().default("created_at"),
  sort_dir: z.enum(["asc", "desc"]).default("desc"),
  name: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
  vendor_ids: z.array(z.string()).optional(),
  collection_ids: z.array(z.string()).optional(),
  from_price: z.number().int().optional(),
  to_price: z.number().int().optional(),
  is_visible: z.boolean().optional(),
  stock_status: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).optional(),
  price_sort_dir: z.enum(["asc", "desc"]).optional(),
  is_for_menu: z.boolean().optional(),
});
