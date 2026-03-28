import { z } from "zod/v4";
import { imageResponseSchema, pagingResponseSchema } from "./common";

// ─── Collection Response ───

export const collectionResponseSchema = z.object({
  id: z.string(),
  image_id: z.string().nullable().optional(),
  image: imageResponseSchema.nullable().optional(),
  title: z.string(),
  description: z.string(),
  is_visible: z.boolean(),
  tag: z.string(),
  size_guide: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const collectionListResponseSchema = z.object({
  items: z.array(collectionResponseSchema),
  paging: pagingResponseSchema,
});

// ─── Create / Update Collection ───

export const createCollectionRequestSchema = z.object({
  title: z.string().min(1, "Tên nhóm sản phẩm không được để trống"),
  product_ids: z.array(z.string()).optional(),
  image_url: z.string().optional(),
  is_visible: z.boolean().optional(),
  description: z.string().optional(),
  size_guide: z.string().optional(),
  tag: z.enum(["SIGNATURE", "SPOTLIGHT"]),
});

export const updateCollectionRequestSchema = z.object({
  title: z.string().optional(),
  product_ids: z.array(z.string()).optional(),
  image_url: z.string().optional(),
  is_visible: z.boolean().optional(),
  tag: z.string().optional(),
  size_guide: z.string().optional(),
  description: z.string().optional(),
});

// ─── Collection Query Params ───

export const collectionQueryParamsSchema = z.object({
  limit: z.number().int().default(20),
  offset: z.number().int().default(0),
  sort_by: z.string().default("created_at"),
  sort_dir: z.enum(["asc", "desc"]).default("desc"),
  name: z.string().optional(),
  is_visible: z.boolean().optional(),
  tag: z.enum(["SIGNATURE", "SPOTLIGHT"]).optional(),
});
