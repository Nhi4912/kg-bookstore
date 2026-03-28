import { z } from "zod/v4";
import { collectionResponseSchema } from "./collection";

// ─── Menu Item Response ───

export interface MenuItemResponseType {
  id: string;
  collection_id: string;
  order_number: number;
  collection?: z.infer<typeof collectionResponseSchema> | null;
  name: string;
  path: string[];
  sub_menus?: MenuItemResponseType[];
}

export const menuItemResponseSchema: z.ZodType<MenuItemResponseType> = z.object({
  id: z.string(),
  collection_id: z.string(),
  order_number: z.number().int(),
  collection: collectionResponseSchema.nullable().optional(),
  name: z.string(),
  path: z.array(z.string()),
  sub_menus: z.lazy(() => z.array(menuItemResponseSchema)).optional(),
});

export const menuResponseSchema = z.object({
  menu_items: z.array(menuItemResponseSchema),
});

// ─── Menu Item Input ───

export interface MenuItemInputType {
  id?: string;
  collection_id: string;
  order_number: number;
  name: string;
  path: string[];
  sub_menus?: MenuItemInputType[];
}

export const menuItemInputSchema: z.ZodType<MenuItemInputType> = z.object({
  id: z.string().optional(),
  collection_id: z.string(),
  order_number: z.number().int(),
  name: z.string(),
  path: z.array(z.string()),
  sub_menus: z.lazy(() => z.array(menuItemInputSchema)).optional(),
});

export const upsertMenuRequestSchema = z.object({
  menu_items: z.array(menuItemInputSchema),
});
