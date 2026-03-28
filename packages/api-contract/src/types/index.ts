import type { z } from "zod/v4";
import type {
  // Common
  pagingParamsSchema,
  pagingResponseSchema,
  imageRequestSchema,
  imageResponseSchema,
  createdResponseSchema,
  // Enums
  orderStatusSchema,
  shipmentStatusSchema,
  billItemTypeSchema,
  billItemStatusSchema,
  paymentMethodSchema,
  collectionTagSchema,
  productStockStatusSchema,
  voucherAmountTypeSchema,
  // Auth
  signInRequestSchema,
  signInResponseSchema,
  signUpRequestSchema,
  adminProfileSchema,
  // Product
  vendorResponseSchema,
  categoryResponseSchema,
  attributeValueResponseSchema,
  attributeResponseSchema,
  attributeListResponseSchema,
  categoryListResponseSchema,
  variantResponseSchema,
  productResponseSchema,
  productListResponseSchema,
  createProductRequestSchema,
  updateProductRequestSchema,
  productQueryParamsSchema,
  attributeValueInputSchema,
  // Variant
  createVariantRequestSchema,
  updateVariantRequestSchema,
  // Collection
  collectionResponseSchema,
  collectionListResponseSchema,
  createCollectionRequestSchema,
  updateCollectionRequestSchema,
  collectionQueryParamsSchema,
  // Order
  customerInputSchema,
  customerResponseSchema,
  shipmentInputSchema,
  shipmentResponseSchema,
  orderItemInputSchema,
  orderItemResponseSchema,
  billItemInputSchema,
  billItemResponseSchema,
  createOrderRequestSchema,
  updateOrderRequestSchema,
  orderResponseSchema,
  orderListResponseSchema,
  orderQueryParamsSchema,
  // Menu
  menuItemResponseSchema,
  menuResponseSchema,
  menuItemInputSchema,
  upsertMenuRequestSchema,
  // Location
  provinceResponseSchema,
  provinceListResponseSchema,
  districtResponseSchema,
  districtListResponseSchema,
  wardResponseSchema,
  wardListResponseSchema,
  // Tags & Discounts
  tagResponseSchema,
  tagListResponseSchema,
  discountResponseSchema,
  discountListResponseSchema,
  createDiscountRequestSchema,
  voucherResponseSchema,
} from "../schemas";

// ─── Common ───
export type PagingParams = z.infer<typeof pagingParamsSchema>;
export type PagingResponse = z.infer<typeof pagingResponseSchema>;
export type ImageRequest = z.infer<typeof imageRequestSchema>;
export type ImageResponse = z.infer<typeof imageResponseSchema>;
export type CreatedResponse = z.infer<typeof createdResponseSchema>;

// ─── Enums ───
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type ShipmentStatus = z.infer<typeof shipmentStatusSchema>;
export type BillItemType = z.infer<typeof billItemTypeSchema>;
export type BillItemStatus = z.infer<typeof billItemStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type CollectionTag = z.infer<typeof collectionTagSchema>;
export type ProductStockStatus = z.infer<typeof productStockStatusSchema>;
export type VoucherAmountType = z.infer<typeof voucherAmountTypeSchema>;

// ─── Auth ───
export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type SignInResponse = z.infer<typeof signInResponseSchema>;
export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type AdminProfile = z.infer<typeof adminProfileSchema>;

// ─── Product ───
export type VendorResponse = z.infer<typeof vendorResponseSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type AttributeValueResponse = z.infer<typeof attributeValueResponseSchema>;
export type AttributeResponse = z.infer<typeof attributeResponseSchema>;
export type AttributeListResponse = z.infer<typeof attributeListResponseSchema>;
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
export type VariantResponse = z.infer<typeof variantResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductListResponse = z.infer<typeof productListResponseSchema>;
export type AttributeValueInput = z.infer<typeof attributeValueInputSchema>;
export type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductRequestSchema>;
export type ProductQueryParams = z.infer<typeof productQueryParamsSchema>;

// ─── Variant ───
export type CreateVariantRequest = z.infer<typeof createVariantRequestSchema>;
export type UpdateVariantRequest = z.infer<typeof updateVariantRequestSchema>;

// ─── Collection ───
export type CollectionResponse = z.infer<typeof collectionResponseSchema>;
export type CollectionListResponse = z.infer<typeof collectionListResponseSchema>;
export type CreateCollectionRequest = z.infer<typeof createCollectionRequestSchema>;
export type UpdateCollectionRequest = z.infer<typeof updateCollectionRequestSchema>;
export type CollectionQueryParams = z.infer<typeof collectionQueryParamsSchema>;

// ─── Order ───
export type CustomerInput = z.infer<typeof customerInputSchema>;
export type CustomerResponse = z.infer<typeof customerResponseSchema>;
export type ShipmentInput = z.infer<typeof shipmentInputSchema>;
export type ShipmentResponse = z.infer<typeof shipmentResponseSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type OrderItemResponse = z.infer<typeof orderItemResponseSchema>;
export type BillItemInput = z.infer<typeof billItemInputSchema>;
export type BillItemResponse = z.infer<typeof billItemResponseSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type UpdateOrderRequest = z.infer<typeof updateOrderRequestSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type OrderListResponse = z.infer<typeof orderListResponseSchema>;
export type OrderQueryParams = z.infer<typeof orderQueryParamsSchema>;

// ─── Menu ───
export type MenuItemResponse = z.infer<typeof menuItemResponseSchema>;
export type MenuResponse = z.infer<typeof menuResponseSchema>;
export type MenuItemInput = z.infer<typeof menuItemInputSchema>;
export type UpsertMenuRequest = z.infer<typeof upsertMenuRequestSchema>;

// ─── Location ───
export type ProvinceResponse = z.infer<typeof provinceResponseSchema>;
export type ProvinceListResponse = z.infer<typeof provinceListResponseSchema>;
export type DistrictResponse = z.infer<typeof districtResponseSchema>;
export type DistrictListResponse = z.infer<typeof districtListResponseSchema>;
export type WardResponse = z.infer<typeof wardResponseSchema>;
export type WardListResponse = z.infer<typeof wardListResponseSchema>;

// ─── Tags & Discounts ───
export type TagResponse = z.infer<typeof tagResponseSchema>;
export type TagListResponse = z.infer<typeof tagListResponseSchema>;
export type DiscountResponse = z.infer<typeof discountResponseSchema>;
export type DiscountListResponse = z.infer<typeof discountListResponseSchema>;
export type CreateDiscountRequest = z.infer<typeof createDiscountRequestSchema>;
export type VoucherResponse = z.infer<typeof voucherResponseSchema>;
