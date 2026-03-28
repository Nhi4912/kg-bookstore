// ─── Common ───
export {
  pagingParamsSchema,
  pageInfoSchema,
  pagingResponseSchema,
  orderStatusSchema,
  shipmentStatusSchema,
  billItemTypeSchema,
  billItemStatusSchema,
  paymentMethodSchema,
  collectionTagSchema,
  productStockStatusSchema,
  voucherAmountTypeSchema,
  imageRequestSchema,
  imageResponseSchema,
  createdResponseSchema,
} from "./common";

// ─── Auth ───
export {
  signInRequestSchema,
  signInResponseSchema,
  signUpRequestSchema,
  adminProfileSchema,
} from "./auth";

// ─── Product ───
export {
  vendorResponseSchema,
  categoryResponseSchema,
  attributeValueResponseSchema,
  attributeResponseSchema,
  attributeListResponseSchema,
  categoryListResponseSchema,
  variantResponseSchema,
  productCollectionPathSchema,
  productResponseSchema,
  productListResponseSchema,
  attributeValueInputSchema,
  createProductRequestSchema,
  updateProductRequestSchema,
  productQueryParamsSchema,
} from "./product";

// ─── Variant ───
export {
  createVariantRequestSchema,
  updateVariantRequestSchema,
} from "./variant";

// ─── Collection ───
export {
  collectionResponseSchema,
  collectionListResponseSchema,
  createCollectionRequestSchema,
  updateCollectionRequestSchema,
  collectionQueryParamsSchema,
} from "./collection";

// ─── Order ───
export {
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
} from "./order";

// ─── Menu ───
export {
  menuItemResponseSchema,
  menuResponseSchema,
  menuItemInputSchema,
  upsertMenuRequestSchema,
} from "./menu";
export type { MenuItemResponseType, MenuItemInputType } from "./menu";

// ─── Location, Tags, Discounts, Vouchers ───
export {
  provinceResponseSchema,
  provinceListResponseSchema,
  districtResponseSchema,
  districtListResponseSchema,
  wardResponseSchema,
  wardListResponseSchema,
  tagResponseSchema,
  tagListResponseSchema,
  discountProductResponseSchema,
  discountResponseSchema,
  discountListResponseSchema,
  createDiscountRequestSchema,
  voucherResponseSchema,
} from "./location";
