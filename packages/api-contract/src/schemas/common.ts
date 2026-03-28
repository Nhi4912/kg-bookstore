import { z } from "zod/v4";

// ─── Pagination ───

export const pagingParamsSchema = z.object({
  limit: z.number().int().default(20),
  offset: z.number().int().default(0),
  sort_by: z.string().default("created_at"),
  sort_dir: z.enum(["asc", "desc"]).default("desc"),
});

export const pageInfoSchema = z.object({
  limit: z.number().int(),
  offset: z.number().int(),
});

export const pagingResponseSchema = z.object({
  total: z.number().int(),
  next_page: pageInfoSchema.nullable().optional(),
  prev_page: pageInfoSchema.nullable().optional(),
});

// ─── Enums ───

export const orderStatusSchema = z.enum([
  "PENDING",
  "SUBMITTED",
  "CANCELLED",
  "INVOICED",
]);

export const shipmentStatusSchema = z.enum([
  "NONE",
  "PENDING",
  "PACKED",
  "DELIVERING",
  "DELIVERED",
  "RETURNED",
]);

export const billItemTypeSchema = z.enum([
  "PRODUCT_BILL",
  "VOUCHER_BILL",
  "EXTRA_FEE_BILL",
  "SHIPPING_BILL",
  "ADJUSTMENT_BILL",
  "DISCOUNT_BILL",
]);

export const billItemStatusSchema = z.enum([
  "PENDING",
  "BILLED",
  "SHIPPING",
  "INVOICED",
  "CANCELLED",
]);

export const paymentMethodSchema = z.enum([
  "CASH",
  "CREDIT_AND_DEBIT",
  "MOBILE_WALLET",
  "BANK_TRANSFER",
  "CASH_ON_DELIVERY",
]);

export const collectionTagSchema = z.enum(["SIGNATURE", "SPOTLIGHT"]);

export const productStockStatusSchema = z.enum(["IN_STOCK", "OUT_OF_STOCK"]);

export const voucherAmountTypeSchema = z.enum(["FIXED_AMOUNT", "PERCENTAGE"]);

// ─── Image ───

export const imageRequestSchema = z.object({
  url: z.string(),
  file_name: z.string(),
  alt: z.string(),
  order: z.number().int(),
});

export const imageResponseSchema = z.object({
  id: z.string(),
  file_name: z.string(),
  url: z.string(),
  alt: z.string(),
  extension: z.string(),
  size: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Created Response ───

export const createdResponseSchema = z.object({
  id: z.string(),
});
