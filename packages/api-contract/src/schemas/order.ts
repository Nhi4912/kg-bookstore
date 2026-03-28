import { z } from "zod/v4";
import {
  imageResponseSchema,
  orderStatusSchema,
  paymentMethodSchema,
  pagingResponseSchema,
} from "./common";

// ─── Customer ───

export const customerInputSchema = z.object({
  id: z.string().optional(),
  phone_number: z
    .string()
    .min(1, "SĐT không được để trống")
    .regex(
      /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
      "SĐT không hợp lệ",
    ),
  last_name: z.string().min(1, "Họ không được để trống"),
  first_name: z.string().min(1, "Tên không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
});

export const customerResponseSchema = z.object({
  id: z.string(),
  phone_number: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  address: z.string().optional(),
  customer_type: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Shipment ───

export const shipmentInputSchema = z.object({
  ward_id: z.string(),
  district_id: z.string(),
  province_id: z.string(),
  address: z.string(),
});

export const shipmentResponseSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  customer_id: z.string(),
  status: z.string(),
  province_id: z.string().optional(),
  district_id: z.string().optional(),
  ward_id: z.string().optional(),
  province_name: z.string().optional(),
  district_name: z.string().optional(),
  ward_name: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
});

// ─── Order Item ───

export const orderItemInputSchema = z.object({
  variant_id: z.string(),
  quantity: z.number().int().min(1),
  discount_id: z.string().optional(),
});

export const orderItemAttributeValueSchema = z.object({
  attribute_name: z.string(),
  attribute_value: z.string(),
});

export const orderItemDiscountSchema = z.object({
  discount_id: z.string(),
  discount_name: z.string(),
  discount_amount_type: z.string(),
  discount_amount_value: z.number().int(),
});

export const orderItemResponseSchema = z.object({
  id: z.string(),
  variant_id: z.string(),
  order_id: z.string(),
  user_product_id: z.string().optional(),
  image: imageResponseSchema.optional(),
  attribute_values: z.array(orderItemAttributeValueSchema).optional(),
  quantity: z.number().int(),
  product_name: z.string(),
  product_price: z.number().int(),
  discounts: z.array(orderItemDiscountSchema).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Bill Item ───

export const billItemInputSchema = z.object({
  variant_id: z.string().optional(),
  discount_id: z.string().optional(),
  voucher_id: z.string().optional(),
  type: z.string(),
  discount_price: z.number().int().optional(),
  final_price: z.number().int(),
});

export const billItemResponseSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  user_product_id: z.string().optional(),
  customer_id: z.string().optional(),
  variant_id: z.string().optional(),
  discount_id: z.string().optional(),
  discount_name: z.string().optional(),
  discount_amount_type: z.string().optional(),
  discount_amount_value: z.number().int().optional(),
  voucher_id: z.string().optional(),
  voucher_name: z.string().optional(),
  voucher_amount_type: z.string().optional(),
  voucher_amount_value: z.number().int().optional(),
  payment_method: z.string().optional(),
  status: z.string(),
  type: z.string(),
  quantity: z.number().int().optional(),
  product_price: z.number().int().optional(),
  discount_price: z.number().int().optional(),
  final_price: z.number().int(),
  adjustment_price: z.number().int().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Order ───

export const createOrderRequestSchema = z.object({
  order_items: z.array(orderItemInputSchema).min(1, "Đơn hàng cần ít nhất 1 sản phẩm"),
  bill_items: z.array(billItemInputSchema),
  customer: customerInputSchema,
  payment_method: paymentMethodSchema,
  shipment: shipmentInputSchema.nullable().optional(),
  note: z.string().optional(),
});

export const updateOrderRequestSchema = z.object({
  order_id: z.string(),
  order_status: orderStatusSchema,
});

export const orderResponseSchema = z.object({
  order_id: z.string(),
  customer: customerResponseSchema.optional(),
  shipment: shipmentResponseSchema.nullable().optional(),
  status: z.string(),
  note: z.string().optional(),
  sequence_number: z.number().int().optional(),
  order_items: z.array(orderItemResponseSchema),
  bill_items: z.array(billItemResponseSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export const orderListResponseSchema = z.object({
  items: z.array(orderResponseSchema),
  paging: pagingResponseSchema,
});

// ─── Order Query Params ───

export const orderQueryParamsSchema = z.object({
  limit: z.number().int().default(20),
  offset: z.number().int().default(0),
  sort_by: z.string().default("created_at"),
  sort_dir: z.enum(["asc", "desc"]).default("desc"),
  keyword: z.string().optional(),
  order_statuses: z.array(orderStatusSchema).optional(),
  shipment_statuses: z.array(z.string()).optional(),
  payment_status: z.string().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
});
