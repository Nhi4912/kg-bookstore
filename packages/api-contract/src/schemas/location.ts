import { z } from "zod/v4";
import { pagingResponseSchema } from "./common";

// ─── Location ───

export const provinceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
});

export const provinceListResponseSchema = z.object({
  items: z.array(provinceResponseSchema),
  paging: pagingResponseSchema,
});

export const districtResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  province_id: z.string(),
});

export const districtListResponseSchema = z.object({
  items: z.array(districtResponseSchema),
  paging: pagingResponseSchema,
});

export const wardResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  district_id: z.string(),
});

export const wardListResponseSchema = z.object({
  items: z.array(wardResponseSchema),
  paging: pagingResponseSchema,
});

// ─── Tag ───

export const tagResponseSchema = z.object({
  tag_id: z.string(),
  tag_name: z.string(),
  collection_ids: z.array(z.string()),
});

export const tagListResponseSchema = z.object({
  items: z.array(tagResponseSchema),
});

// ─── Discount ───

export const discountProductResponseSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  discount_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const discountResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  discount_amount_type: z.string(),
  discount_amount_value: z.number().int(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  discount_products: z.array(discountProductResponseSchema).optional(),
});

export const discountListResponseSchema = z.object({
  items: z.array(discountResponseSchema),
  paging: pagingResponseSchema,
});

export const createDiscountRequestSchema = z.object({
  name: z.string().min(1),
  discount_amount_type: z.string(),
  discount_amount_value: z.number().int(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});

// ─── Voucher ───

export const voucherResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  voucher_amount_type: z.enum(["FIXED_AMOUNT", "PERCENTAGE"]),
  voucher_amount_value: z.number().int(),
  is_active: z.boolean(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  min_order_final_price: z.number().int().optional(),
  max_uses: z.number().int().optional(),
  max_uses_per_user: z.number().int().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
