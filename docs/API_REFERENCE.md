# KGBookstore Backend API Reference

> **Base URL**: `/api/vac_shop` > **Auth**: JWT Bearer token in Authorization header
> **Content-Type**: `application/json`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Variants](#3-variants)
4. [Collections](#4-collections)
5. [Orders](#5-orders)
6. [Menu](#6-menu)
7. [Attributes](#7-attributes)
8. [Categories & Vendors](#8-categories--vendors)
9. [Tags](#9-tags)
10. [Discounts & Vouchers](#10-discounts--vouchers)
11. [Location (Province/District/Ward)](#11-location)
12. [Shared Types](#12-shared-types)
13. [Enums](#13-enums)
14. [Pagination](#14-pagination)

---

## 1. Authentication

### POST `/admins/sign-up` (Public)

**Request:**

```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string | null",
  "password": "string (required)",
  "confirm_password": "string (required)",
  "url": "string"
}
```

**Response:** `201 Created`

```json
{
  "id": "string"
}
```

### POST `/admins/sign-in` (Public)

**Request:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "profile": {
    "id": "string",
    "account_id": "string",
    "email": "string",
    "name": "string",
    "phone": "string | null",
    "avatar_url": "string | null",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

**Auth Details:**

- Access token expires in 72 hours (3 days)
- Refresh token expires in 4380 hours (6 months)
- JWT Claims: `{ UserID, AccountID, RegisteredClaims }`
- Protected routes use `Authorization: Bearer <access_token>` header

---

## 2. Products

### GET `/products` (Public)

**Query Parameters (parsed from query string):**

| Param            | Type     | Description                        |
| ---------------- | -------- | ---------------------------------- |
| `limit`          | int      | Items per page (default: 20)       |
| `offset`         | int      | Skip items (default: 0)            |
| `sort_by`        | string   | Sort field (default: "created_at") |
| `sort_dir`       | string   | "asc" or "desc" (default: "desc")  |
| `name`           | string   | Search by name (tsquery full-text) |
| `category_ids`   | string[] | Filter by category IDs             |
| `vendor_ids`     | string[] | Filter by vendor IDs               |
| `collection_ids` | string[] | Filter by collection IDs           |
| `from_price`     | int      | Min price filter                   |
| `to_price`       | int      | Max price filter                   |
| `is_visible`     | bool     | Filter by visibility               |
| `stock_status`   | string   | "IN_STOCK" or "OUT_OF_STOCK"       |
| `price_sort_dir` | string   | Sort by price: "asc" or "desc"     |
| `is_for_menu`    | bool     | Filter for menu usage              |

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "string",
      "vendor_id": "string | null",
      "category_id": "string | null",
      "vendor": { "id": "string", "name": "string", "created_at": "ISO8601", "updated_at": "ISO8601" } | null,
      "category": { "id": "string", "name": "string", "created_at": "ISO8601", "updated_at": "ISO8601" } | null,
      "images": [ImageResponse],
      "variants": [VariantResponse],
      "collection_ids": ["string"],
      "product_collection_paths": [{ "collection_id": "string", "path": ["string"] }],
      "size_guide": "string",
      "name": "string",
      "description": "string (HTML)",
      "quote": "string",
      "type": 0,
      "sequence_number": 0,
      "is_visible": true,
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "paging": {
    "total": 0,
    "next_page": { "limit": 20, "offset": 20 } | null,
    "prev_page": { "limit": 20, "offset": 0 } | null
  }
}
```

### GET `/products/{product-id}` (Public)

**Response:** `200 OK` — Single `ProductResponse` (same shape as list item)

### POST `/products/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "vendor_id": "string | null",
  "category_id": "string | null",
  "collection_ids": ["string"],
  "images": [
    {
      "url": "string (Cloudinary URL)",
      "file_name": "string",
      "alt": "string",
      "order": 0
    }
  ],
  "variants": [
    {
      "attribute_values": [{ "attribute_id": "string", "value": "string" }],
      "cost_price": 0,
      "retail_price": 0,
      "sku": "string",
      "barcode": "string",
      "stock_quantity": 0,
      "image": {
        "url": "string",
        "file_name": "string",
        "alt": "string",
        "order": 0
      }
    }
  ],
  "name": "string",
  "description": "string (HTML from CKEditor)",
  "quote": "string",
  "type": 0,
  "is_visible": true
}
```

**Response:** `201 Created`

```json
{ "id": "string" }
```

**Business Logic:**

- Creates product, variants, images, and collection associations in a single transaction
- Images are Cloudinary URLs (uploaded client-side)
- Each variant can have multiple attribute values and an optional image

### PUT `/products/with-admin/{product-id}` (Employee Auth Required)

**Request:**

```json
{
  "vendor_id": "string | null",
  "category_id": "string | null",
  "collection_ids": ["string"],
  "is_update_images": true,
  "images": [ImageRequest],
  "name": "string",
  "description": "string",
  "quote": "string",
  "type": 0,
  "is_visible": true
}
```

**Notes:**

- `is_update_images`: When true, replaces all product images with the provided list
- Collection associations are fully replaced (old removed, new added)

**Response:** `200 OK`

### DELETE `/products/with-admin/{product-id}` (Employee Auth Required)

**Response:** `200 OK` — Cascades: deletes variants, images, collection associations

---

## 3. Variants

### POST `/products/{product-id}/variants/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "attribute_values": [
    { "attribute_id": "string", "value": "string" }
  ],
  "cost_price": 0,
  "retail_price": 0,
  "sku": "string",
  "barcode": "string",
  "stock_quantity": 0,
  "image": { "url": "string", "file_name": "string", "alt": "string", "order": 0 } | null
}
```

**Response:** `201 Created`

```json
{ "id": "string" }
```

### PUT `/products/{product-id}/variants/{variant-id}/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "attribute_values": [
    { "attribute_id": "string", "value": "string" }
  ],
  "cost_price": 0,
  "retail_price": 0,
  "sku": "string",
  "barcode": "string",
  "stock_quantity": 0,
  "image": { "url": "string", "file_name": "string", "alt": "string", "order": 0 } | null,
  "is_update_image": true
}
```

### DELETE `/products/{product-id}/variants/{variant-id}/with-admin` (Employee Auth Required)

**Response:** `200 OK`

### VariantResponse Shape

```json
{
  "id": "string",
  "product_id": "string",
  "product": "ProductResponse | null",
  "image_id": "string | null",
  "image": {
    "id": "string",
    "file_name": "string",
    "url": "string",
    "alt": "string",
    "extension": "string",
    "size": 0,
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  } | null,
  "attributes": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "value": "string",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "barcode": "string",
  "sku": "string",
  "retail_price": 0,
  "cost_price": 0,
  "stock_quantity": 0,
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

---

## 4. Collections

### GET `/collections` (Public)

**Query Parameters:**

| Param        | Type   | Description                               |
| ------------ | ------ | ----------------------------------------- |
| `limit`      | int    | Default: 20                               |
| `offset`     | int    | Default: 0                                |
| `sort_by`    | string | Default: "created_at"                     |
| `sort_dir`   | string | Default: "desc"                           |
| `name`       | string | Search by name (tsquery)                  |
| `is_visible` | bool   | Filter by visibility                      |
| `tag`        | string | Filter by tag: "SIGNATURE" or "SPOTLIGHT" |

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "string",
      "image_id": "string | null",
      "image": "ImageResponse | null",
      "title": "string",
      "description": "string (HTML)",
      "is_visible": true,
      "tag": "SIGNATURE | SPOTLIGHT",
      "size_guide": "string",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "paging": "PagingResponse"
}
```

### GET `/collections/{collection-id}` (Public)

**Response:** `200 OK` — Single `CollectionResponse`

### POST `/collections/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "product_ids": ["string"],
  "image_url": "string (Cloudinary URL)",
  "title": "string",
  "is_visible": true,
  "description": "string (HTML from CKEditor)",
  "size_guide": "string",
  "tag": "SIGNATURE | SPOTLIGHT (required)"
}
```

**Response:** `201 Created`

```json
{ "id": "string" }
```

### PUT `/collections/with-admin/{collection-id}` (Employee Auth Required)

**Request:**

```json
{
  "product_ids": ["string"],
  "image_url": "string",
  "title": "string",
  "is_visible": true,
  "tag": "string",
  "size_guide": "string",
  "description": "string"
}
```

**Response:** `200 OK`

### DELETE `/collections/with-admin/{collection-id}` (Employee Auth Required)

**Response:** `200 OK`
**Business Logic:** Checks if collection is used in menu before deleting. Removes product associations.

---

## 5. Orders

### POST `/orders/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "order_items": [
    {
      "variant_id": "string (required)",
      "quantity": 0,
      "discount_id": "string"
    }
  ],
  "bill_items": [
    {
      "variant_id": "string",
      "discount_id": "string",
      "voucher_id": "string",
      "type": "PRODUCT_BILL | VOUCHER_BILL | EXTRA_FEE_BILL | SHIPPING_BILL | ADJUSTMENT_BILL | DISCOUNT_BILL",
      "discount_price": 0,
      "final_price": 0
    }
  ],
  "customer": {
    "id": "string (optional, for existing customer)",
    "phone_number": "string (required)",
    "last_name": "string (required)",
    "first_name": "string (required)",
    "address": "string"
  },
  "payment_method": "CASH | CREDIT_AND_DEBIT | MOBILE_WALLET | BANK_TRANSFER | CASH_ON_DELIVERY (required)",
  "shipment": {
    "ward_id": "string (required)",
    "district_id": "string (required)",
    "province_id": "string (required)",
    "address": "string (required)"
  } | null,
  "note": "string"
}
```

**Response:** `201 Created`

```json
{ "id": "string" }
```

**Business Logic:**

1. Validates/creates customer by phone number (upsert by phone)
2. Validates voucher if present (active, date range, usage limits)
3. Validates order items (variant exists, stock available)
4. Creates order, order items, bill items, shipment in transaction
5. Updates stock quantities

### POST `/orders` (Public)

Same request shape as admin create, but `PublicCreateOrderRequest` (identical fields).

### GET `/orders/with-admin` (Employee Auth Required)

**Query Parameters:**

| Param               | Type     | Description                                                    |
| ------------------- | -------- | -------------------------------------------------------------- |
| `limit`             | int      | Default: 20                                                    |
| `offset`            | int      | Default: 0                                                     |
| `sort_by`           | string   | Default: "created_at"                                          |
| `sort_dir`          | string   | Default: "desc"                                                |
| `keyword`           | string   | Search customer name or phone                                  |
| `order_statuses`    | string[] | Filter: PENDING, SUBMITTED, CANCELLED, INVOICED                |
| `shipment_statuses` | string[] | Filter: NONE, PENDING, PACKED, DELIVERING, DELIVERED, RETURNED |
| `payment_status`    | string   | Filter by payment status                                       |
| `created_from`      | ISO8601  | Start date filter                                              |
| `created_to`        | ISO8601  | End date filter                                                |

**Response:** `200 OK`

```json
{
  "items": [
    {
      "order_id": "string",
      "customer": {
        "id": "string",
        "phone_number": "string",
        "last_name": "string",
        "first_name": "string",
        "address": "string",
        "customer_type": "string",
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      },
      "shipment": {
        "id": "string",
        "order_id": "string",
        "customer_id": "string",
        "status": "string",
        "province_id": "string",
        "district_id": "string",
        "ward_id": "string",
        "province_name": "string",
        "district_name": "string",
        "ward_name": "string",
        "address": "string",
        "phone_number": "string"
      } | null,
      "status": "PENDING | SUBMITTED | CANCELLED | INVOICED",
      "note": "string",
      "sequence_number": 0,
      "order_items": [
        {
          "id": "string",
          "variant_id": "string",
          "order_id": "string",
          "user_product_id": "string",
          "image": "ImageResponse",
          "attribute_values": [
            { "attribute_name": "string", "attribute_value": "string" }
          ],
          "quantity": 0,
          "product_name": "string",
          "product_price": 0,
          "discounts": [
            {
              "discount_id": "string",
              "discount_name": "string",
              "discount_amount_type": "string",
              "discount_amount_value": 0
            }
          ],
          "created_at": "ISO8601",
          "updated_at": "ISO8601"
        }
      ],
      "bill_items": [
        {
          "id": "string",
          "order_id": "string",
          "user_product_id": "string",
          "customer_id": "string",
          "variant_id": "string",
          "discount_id": "string",
          "discount_name": "string",
          "discount_amount_type": "string",
          "discount_amount_value": 0,
          "voucher_id": "string",
          "voucher_name": "string",
          "voucher_amount_type": "string",
          "voucher_amount_value": 0,
          "payment_method": "string",
          "status": "PENDING | BILLED | SHIPPING | INVOICED | CANCELLED",
          "type": "PRODUCT_BILL | VOUCHER_BILL | ...",
          "quantity": 0,
          "product_price": 0,
          "discount_price": 0,
          "final_price": 0,
          "adjustment_price": 0,
          "created_at": "ISO8601",
          "updated_at": "ISO8601"
        }
      ],
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "paging": "PagingResponse"
}
```

### GET `/orders/with-admin/{order-id}` (Employee Auth Required)

**Response:** `200 OK` — Single `OrderResponse` (same shape as list item)

### PUT `/orders/with-admin/{order-id}` (Employee Auth Required)

**Request:**

```json
{
  "order_id": "string (required)",
  "order_status": "PENDING | SUBMITTED | CANCELLED | INVOICED"
}
```

**Response:** `200 OK`
**Business Logic:** Updates order status. Stock management occurs on status change (e.g., cancellation restores stock).

---

## 6. Menu

### GET `/menus/with-admin` (Employee Auth Required)

**Response:** `200 OK`

```json
{
  "menu_items": [
    {
      "id": "string",
      "collection_id": "string",
      "order_number": 0,
      "collection": "CollectionResponse | null",
      "name": "string",
      "path": ["string (parent IDs)"],
      "sub_menus": [
        {
          "id": "string",
          "collection_id": "string",
          "order_number": 0,
          "collection": "CollectionResponse | null",
          "name": "string",
          "path": ["string"],
          "sub_menus": []
        }
      ]
    }
  ]
}
```

**Notes:**

- Menu uses materialized path pattern (path[] stores ancestor IDs)
- Sub-menus are nested recursively
- Each menu item links to a collection

### POST `/menus/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "menu_items": [
    {
      "id": "string",
      "collection_id": "string",
      "order_number": 0,
      "name": "string",
      "path": ["string"],
      "sub_menus": [
        {
          "id": "string",
          "collection_id": "string",
          "order_number": 0,
          "name": "string",
          "path": ["string"],
          "sub_menus": []
        }
      ]
    }
  ]
}
```

**Business Logic:** Replaces the entire menu tree. Validates tree structure before upserting.

---

## 7. Attributes

### GET `/attributes` (Public)

**Query Parameters:**

| Param    | Type | Description |
| -------- | ---- | ----------- |
| `limit`  | int  | Default: 20 |
| `offset` | int  | Default: 0  |

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ]
}
```

---

## 8. Categories & Vendors

### GET `/categories` (Public)

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ]
}
```

### POST `/categories/with-admin` (Employee Auth Required)

**Request:**

```json
{ "name": "string" }
```

---

## 9. Tags

### GET `/tags` (Public)

**Response:** `200 OK`

```json
{
  "items": [
    {
      "tag_id": "string",
      "tag_name": "string",
      "collection_ids": ["string"]
    }
  ]
}
```

---

## 10. Discounts & Vouchers

### POST `/discounts/with-admin` (Employee Auth Required)

**Request:**

```json
{
  "name": "string (required)",
  "discount_amount_type": "string (required)",
  "discount_amount_value": 0,
  "start_date": "ISO8601 | null",
  "end_date": "ISO8601 | null"
}
```

### GET `/discounts/with-admin` (Employee Auth Required)

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "discount_amount_type": "string",
      "discount_amount_value": 0,
      "start_date": "ISO8601 | null",
      "end_date": "ISO8601 | null",
      "created_at": "ISO8601",
      "updated_at": "ISO8601",
      "discount_products": [
        {
          "id": "string",
          "product_id": "string",
          "product": "ProductResponse | null",
          "discount_id": "string",
          "created_at": "ISO8601",
          "updated_at": "ISO8601"
        }
      ]
    }
  ],
  "paging": "PagingResponse"
}
```

### GET `/vouchers?code={code}` (Public)

**Response:** `200 OK`

```json
{
  "id": "string",
  "name": "string",
  "code": "string",
  "voucher_amount_type": "FIXED_AMOUNT | PERCENTAGE",
  "voucher_amount_value": 0,
  "is_active": true,
  "start_date": "ISO8601 | null",
  "end_date": "ISO8601 | null",
  "min_order_final_price": 0,
  "max_uses": 0,
  "max_uses_per_user": 0,
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

---

## 11. Location

### GET `/public/provinces` (Public)

**Query:** `name` (string, text search)

**Response:**

```json
{
  "items": [{ "id": "string", "name": "string", "type": "string" }],
  "paging": "PagingResponse"
}
```

### GET `/public/districts` (Public)

**Query:** `province_id` (required), `name` (text search)

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "province_id": "string"
    }
  ],
  "paging": "PagingResponse"
}
```

### GET `/public/wards` (Public)

**Query:** `district_id` (required), `name` (text search)

**Response:**

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "district_id": "string"
    }
  ],
  "paging": "PagingResponse"
}
```

---

## 12. Shared Types

### ImageRequest

```json
{
  "url": "string (Cloudinary URL)",
  "file_name": "string",
  "alt": "string",
  "order": 0
}
```

### ImageResponse

```json
{
  "id": "string",
  "file_name": "string",
  "url": "string",
  "alt": "string",
  "extension": "string",
  "size": 0,
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

### ProductCollectionPath

```json
{
  "collection_id": "string",
  "path": ["string (ancestor menu item IDs)"]
}
```

### Customer

```json
{
  "id": "string",
  "phone_number": "string",
  "last_name": "string",
  "first_name": "string",
  "address": "string",
  "customer_type": "string",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

### CreatedResponse

```json
{ "id": "string" }
```

---

## 13. Enums

| Enum                   | Values                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| **OrderStatus**        | `PENDING`, `SUBMITTED`, `CANCELLED`, `INVOICED`                                                       |
| **ShipmentStatus**     | `NONE`, `PENDING`, `PACKED`, `DELIVERING`, `DELIVERED`, `RETURNED`                                    |
| **BillItemType**       | `PRODUCT_BILL`, `VOUCHER_BILL`, `EXTRA_FEE_BILL`, `SHIPPING_BILL`, `ADJUSTMENT_BILL`, `DISCOUNT_BILL` |
| **BillItemStatus**     | `PENDING`, `BILLED`, `SHIPPING`, `INVOICED`, `CANCELLED`                                              |
| **PaymentMethod**      | `CASH`, `CREDIT_AND_DEBIT`, `MOBILE_WALLET`, `BANK_TRANSFER`, `CASH_ON_DELIVERY`                      |
| **CollectionTag**      | `SIGNATURE`, `SPOTLIGHT`                                                                              |
| **ProductStockStatus** | `IN_STOCK`, `OUT_OF_STOCK`                                                                            |
| **VoucherAmountType**  | `FIXED_AMOUNT`, `PERCENTAGE`                                                                          |

---

## 14. Pagination

### Request (Query Parameters)

| Param      | Type   | Default      | Description     |
| ---------- | ------ | ------------ | --------------- |
| `limit`    | int    | 20           | Items per page  |
| `offset`   | int    | 0            | Items to skip   |
| `sort_by`  | string | "created_at" | Sort field      |
| `sort_dir` | string | "desc"       | "asc" or "desc" |

### Response Shape

```json
{
  "total": 100,
  "next_page": { "limit": 20, "offset": 40 } | null,
  "prev_page": { "limit": 20, "offset": 0 } | null
}
```

---

## API Route Summary Table

| Method | Route                                        | Auth     | Description                  |
| ------ | -------------------------------------------- | -------- | ---------------------------- |
| POST   | `/admins/sign-up`                            | Public   | Register admin               |
| POST   | `/admins/sign-in`                            | Public   | Login                        |
| GET    | `/products`                                  | Public   | List products (with filters) |
| GET    | `/products/{product-id}`                     | Public   | Get product detail           |
| POST   | `/products/with-admin`                       | Employee | Create product               |
| PUT    | `/products/with-admin/{product-id}`          | Employee | Update product               |
| DELETE | `/products/with-admin/{product-id}`          | Employee | Delete product               |
| POST   | `/products/{product-id}/variants/with-admin` | Employee | Create variant               |
| GET    | `/categories`                                | Public   | List categories              |
| POST   | `/categories/with-admin`                     | Employee | Create category              |
| GET    | `/attributes`                                | Public   | List attributes              |
| GET    | `/collections`                               | Public   | List collections             |
| GET    | `/collections/{collection-id}`               | Public   | Get collection detail        |
| POST   | `/collections/with-admin`                    | Employee | Create collection            |
| PUT    | `/collections/with-admin/{collection-id}`    | Employee | Update collection            |
| DELETE | `/collections/with-admin/{collection-id}`    | Employee | Delete collection            |
| GET    | `/menus/with-admin`                          | Employee | Get menu tree                |
| POST   | `/menus/with-admin`                          | Employee | Upsert menu tree             |
| POST   | `/orders`                                    | Public   | Create order (public)        |
| POST   | `/orders/with-admin`                         | Employee | Create order (admin)         |
| GET    | `/orders/with-admin`                         | Employee | List orders                  |
| GET    | `/orders/with-admin/{order-id}`              | Employee | Get order detail             |
| PUT    | `/orders/with-admin/{order-id}`              | Employee | Update order status          |
| GET    | `/tags`                                      | Public   | Get tags with collections    |
| POST   | `/discounts/with-admin`                      | Employee | Create discount              |
| GET    | `/vouchers`                                  | Public   | Get voucher by code          |
| GET    | `/public/provinces`                          | Public   | List provinces               |
| GET    | `/public/districts`                          | Public   | List districts               |
| GET    | `/public/wards`                              | Public   | List wards                   |

---

## Notes

- **All prices are integers** (stored in smallest currency unit, e.g., VND)
- **All IDs are TEXT** (UUID strings)
- **Images**: Uploaded to Cloudinary client-side; backend stores the URL
- **Soft deletes**: Most entities use `deleted_at` (null = active)
- **Full-text search**: Product name and collection title use PostgreSQL tsvector/tsquery
- **Menu path**: Materialized path pattern where `path[]` contains ancestor menu item IDs
