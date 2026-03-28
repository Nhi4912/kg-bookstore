# Apollo Admin Dashboard — Technical & Feature Documentation

> Migration reference document for rebuilding the `apollo-frontend` (clone-haravan) project from scratch.
> Generated from full codebase analysis on 2026-03-28.

---

## Table of Contents

1. [Overview](#overview)
2. [Current Tech Stack](#current-tech-stack)
3. [New Tech Stack (Target)](#new-tech-stack-target)
4. [Color Theme & Design Tokens](#color-theme--design-tokens)
5. [Project Architecture](#project-architecture)
6. [Features](#features)
   - [Authentication](#1-authentication)
   - [Products](#2-products)
   - [Collections](#3-collections--nhóm-sản-phẩm)
   - [Orders](#4-orders--đơn-hàng)
   - [Menu / Danh Mục](#5-menu--danh-mục)
   - [Global UI](#6-global-ui)
7. [API Endpoints](#api-endpoints)
8. [Data Models](#data-models)
9. [Patterns & Conventions](#patterns--conventions)
10. [Unimplemented / Stub Features](#unimplemented--stub-features)
11. [Implementation Plan](#implementation-plan)
    - [Phase 0 — Project Bootstrap](#phase-0--project-bootstrap)
    - [Phase 1 — Foundation](#phase-1--foundation-auth--layout)
    - [Phase 2 — Products Module](#phase-2--products-module)
    - [Phase 3 — Collections Module](#phase-3--collections-module)
    - [Phase 4 — Orders Module](#phase-4--orders-module)
    - [Phase 5 — Menu Module](#phase-5--menu-module)
    - [Phase 6 — Dialogs](#phase-6--dialogs-shared-across-modules)
    - [Phase 7 — Global UI Polish](#phase-7--global-ui-polish)
12. [Component Mapping (MUI → shadcn)](#component-mapping-mui--shadcn)
13. [Key Implementation Notes](#key-implementation-notes)
14. [File Structure (New Repo)](#file-structure-new-repo)
15. [Form Validation Schemas (Zod)](#form-validation-schemas-zod)

---

## Overview

**Apollo Frontend** là một **Admin Dashboard** dành cho quản trị e-commerce, được xây dựng theo mô hình clone của [Haravan](https://haravan.com) — nền tảng bán hàng phổ biến tại Việt Nam. Toàn bộ UI/UX bằng tiếng Việt, phục vụ quản lý nội bộ cho admin.

**Repo name (cũ):** `clone-haravan`

---

## Current Tech Stack

| Category         | Library/Tool                                   | Version |
| ---------------- | ---------------------------------------------- | ------- |
| Framework        | React                                          | 18.2.0  |
| Language         | TypeScript                                     | 4.9.5   |
| Build tool       | Create React App (`react-scripts`)             | 5.0.1   |
| UI Library       | MUI (Material UI)                              | 5.11.9  |
| UI extras        | Ant Design                                     | 5.8.4   |
| Data grid        | MUI X Data Grid                                | 7.1.0   |
| Routing          | React Router DOM                               | 6.10.0  |
| Data fetching    | TanStack React Query                           | 4.29.3  |
| Form handling    | React Hook Form                                | 7.43.9  |
| Validation       | Joi + @hookform/resolvers                      | 17.9.2  |
| HTTP Client      | Axios                                          | 1.3.6   |
| Rich text editor | CKEditor 5 Classic                             | 40.2.0  |
| Date utils       | Dayjs                                          | 1.11.10 |
| Image upload     | Cloudinary (via axios + Ant Design UploadFile) | —       |
| Number format    | react-number-format                            | 5.3.4   |
| CSS-in-JS        | Emotion + tss-react                            | —       |
| Style            | styled-components                              | 6.0.8   |

---

## New Tech Stack (Target)

| Category   | Old                 | New                                  |
| ---------- | ------------------- | ------------------------------------ |
| Build      | CRA (react-scripts) | **Vite 5**                           |
| UI         | MUI v5 + Ant Design | **shadcn/ui + Tailwind CSS v3**      |
| Validation | Joi                 | **Zod**                              |
| Query      | TanStack v4         | **TanStack Query v5**                |
| Tree       | Ant Design Tree     | **Ant Design Tree** (giữ nguyên)     |
| Rich text  | CKEditor 5          | **CKEditor 5** (giữ nguyên)          |
| Form       | RHF + Joi           | **RHF + Zod**                        |
| HTTP       | Axios               | **Axios** (giữ nguyên)               |
| Date       | Dayjs               | **Dayjs** (giữ nguyên)               |
| Routing    | React Router DOM v6 | **React Router DOM v6** (giữ nguyên) |

---

## Color Theme & Design Tokens

### CSS Variables (giữ nguyên toàn bộ)

```css
:root {
  --default-color: #212121; /* default text */
  --primary-color: #2962ff; /* blue – buttons, links, active states */
  --success-color: #1eb842; /* green */
  --danger-color: #cc3300; /* red */
  --secondary-color: #6c757d; /* gray */
  --border-color: #d9d9d9; /* borders */
}
```

### Sidebar Colors

```css
sidebar-background: #0d3064; /* dark navy blue */
sidebar-icon-text: #7790b6; /* muted blue */
sidebar-active-bg: rgba(25, 118, 210, 0.08); /* active menu item background */
sidebar-active-text: #ffffff; /* white text on active */
sidebar-active-scale: 1.05; /* slight scale on active item */
```

### Page Colors

```css
body-background: #f5f5f5; /* light gray page background */
body-font: "Roboto", sans-serif;
body-font-size: 14px;
body-color: #000000;
```

### Tailwind Config (New)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2962ff",
          foreground: "#ffffff",
        },
        sidebar: {
          DEFAULT: "#0d3064",
          text: "#7790b6",
        },
        success: "#1eb842",
        danger: "#cc3300",
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#6c757d",
        },
        border: "#d9d9d9",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
};
```

---

## Project Architecture

### Current Structure

```
src/
├── App.tsx                  # Root router setup
├── App.css / index.css      # Global styles + CSS variables
├── index.tsx                # React entry point
│
├── layouts/
│   ├── MLayout.tsx          # Main protected layout (sidebar + header + Outlet)
│   ├── MHeader.tsx          # Top header (hamburger + profile avatar)
│   ├── Sidebar.tsx          # Left nav drawer (240px width)
│   └── SidebarItem.tsx      # NavLink sidebar item
│
├── pages/
│   ├── LoginPage.tsx        # /login
│   ├── SignUpPage.tsx       # /sign-up
│   ├── NotFoundPage.tsx     # *
│   ├── GeneralPage.tsx      # / (commented out, placeholder)
│   ├── Product/
│   │   ├── ProductsPage.tsx           # /products (list)
│   │   ├── CreateProductPage.tsx      # /products/create
│   │   ├── EditProductPage.tsx        # /products/:id/edit
│   │   ├── CreateProductVariantPage.tsx  # /products/:id/variants/create
│   │   └── EditProductVariantPage.tsx    # /products/:id/variants/:variantId/edit
│   ├── Order/
│   │   ├── OrdersPage.tsx             # /orders (list)
│   │   ├── CreateOrderPage.tsx        # /orders/create
│   │   └── OrderDetailPage.tsx        # (commented out – stub only)
│   ├── Collection/
│   │   ├── CollectionsPage.tsx        # /collections (list)
│   │   ├── CreateCollectionPage.tsx   # /collections/create
│   │   └── EditCollectionPage.tsx     # /collections/:id/edit
│   └── Menu/
│       └── MenuPage.tsx               # /menus/edit
│
├── components/
│   ├── common/              # Shared components (DataGrid, chips, numeric input)
│   ├── tables/              # ProductTable, OrderTable, OrderItemsTable
│   ├── dialogs/             # ProductSelectionDialog, CollectionSelectionDialog, ConfirmedDialog
│   ├── rhf/                 # React Hook Form wrappers (TextFieldHF, AutocompleteHF, etc.)
│   ├── Collections/         # CollectionFormSection, CollectionsTable, CollectionFilterContainer
│   ├── Orders/              # BillItemSection, CustomerSection, OrderProductSelectedItem
│   └── [shared UI]          # PageWrapper, PaperCustom, PaperContentSection, ActionButtonSection,
│                              ProfileAvatar, ImageInput, PictureWallInput, etc.
│
├── hooks/                   # All data + UI hooks (~40 hooks)
│
└── shared/
    ├── Providers/GlobalProvider.tsx  # Context: snackbar + overlay loading
    ├── constants/           # route.ts, menu.ts, UI.ts, pagination.ts, user.ts, common.ts
    ├── types/               # TypeScript interfaces (forms.ts, services.ts, views.ts, etc.)
    ├── utils/               # service.ts (axios wrappers), cookie.ts, common.ts, array.ts, etc.
    └── helpers/             # customer.ts, order.ts
```

---

## Features

### 1. Authentication

**Routes:** `/login`, `/sign-up`

#### Login (`LoginPage.tsx`)

- **Fields:** email, password
- **Validation:** Joi schema (→ Zod migration)
  - Email: required, valid format, TLDs: `.com`, `.net`, `.vn`
  - Password: required, min 6 chars
- **On success:**
  - JWT token saved to cookie (3-day expiry) via `setCookie()`
  - Admin profile saved to `localStorage`
  - Navigate to `/`
- **API:** `POST /admins/sign-in`
- **Response:** `{ access_token: string, profile: AdminProfile }`

#### Sign Up (`SignUpPage.tsx`)

- **Fields:** name, email, password, confirm_password
- **Validation:**
  - Name: required
  - Email: required, valid format
  - Password: required, min 6 chars
  - Confirm password: required, must match password
- **On success:** Navigate to `/login`
- **API:** `POST /admins/sign-up`

#### Auth Guard

- `MLayout` checks `useAdminProfile().isLogin` → redirect to `/login` if false
- `AuthSection` component: if already logged in → redirect to `/`
- Auth check logic:
  ```ts
  const token = getCookie(ADMIN_REQUEST_TOKEN_KEY); // from cookie
  const profile = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
  isLogin = token !== "" && Object.keys(profile).length >= 0;
  ```

#### Auth Section Component (shared wrapper)

- Center-aligned form (500px width, mt 20vh)
- Title (h4)
- Children (form fields)
- Action button (full width, contained)
- Link below (e.g., "Chưa có tài khoản? Đăng kí")

---

### 2. Products

**Routes:** `/products`, `/products/create`, `/products/:id/edit`, `/products/:id/variants/create`, `/products/:id/variants/:variantId/edit`

#### Product List Page (`ProductsPage.tsx`)

- **Layout:** `PageWrapper > PaperCustom > ProductFilterContainer + ProductTable`
- **Action buttons:** "Tạo nhóm sản phẩm", "Tạo sản phẩm"
- **Filters** (`ProductFilterContainer`):
  - Search by name (text input, debounced)
  - Stock status: `IN_STOCK` | `OUT_OF_STOCK`
  - Price sort: `ASC` | `DESC`
  - Visibility: `VISIBLE` | `INVISIBLE` | `ALL`
- **Table columns** (MUI DataGrid → TanStack Table):
  - Image + Name (linked to edit page, color `#2962ff`)
  - Variant count
  - Description (HTML rendered)
  - Status (Hiển thị / Ẩn)
- **Pagination:** server-side, offset-based (`limit`, `offset`)
- **API:** `GET /products?limit=X&offset=Y&name=&stock_status=&is_visible=&price_sort_dir=`

#### Create Product Page (`CreateProductPage.tsx`)

- **Layout:** 2-column grid (8/4)
- **Left column:**
  - **Section "Thông tin chung":**
    - Tên sản phẩm (TextFieldHF, required)
    - Nhà cung cấp (AutocompleteHF, data from `useVendors`)
    - Loại sản phẩm (AutocompleteHF, required, data from `useCategories`)
    - Mô tả sản phẩm (CKEditor 5, Vietnamese locale)
    - Trích dẫn (TextFieldHF)
  - **Section "Hình Ảnh Sản Phẩm":**
    - PictureWallInput (multiple images, Ant Design Upload style)
    - Tooltip: "Ảnh định dạng jpg, jpeg, png, gif tỉ lệ 1:1 và độ phân giải 2048px x 2048px"
  - **Section "Biến thể" (CreateVariantSection):**
    - Chọn attributes → generate variant combinations
    - Each variant: checkbox, attribute values, retail_price, sku, barcode, stock_quantity
- **Right column:**
  - **Section "Nhóm Sản Phẩm":**
    - Multi-select autocomplete (data from `useCollections`)
  - **Section "Trạng thái":**
    - Checkbox "Hiển thị sản phẩm" (default: true)
- **Submit flow:**
  1. Validate at least 1 variant selected
  2. Upload product images to Cloudinary (`useUploadImage`)
  3. POST product with image URLs
- **API:** `POST /products/with-admin`
- **Validation (Joi → Zod):**
  - name: required
  - category_id: required
  - vendor_id: optional
  - All others: optional

#### Edit Product Page (`EditProductPage.tsx`)

- Same layout as Create
- Pre-fills form data from `useProductDetail(id)`
- Shows existing product images
- Lists existing variants (`ProductVariantEditableSection`)
- **API:** `PUT /products/with-admin/:id`

#### Product Variant Create/Edit Pages

- **Fields:** attribute_values (from attributes), retail_price, cost_price, sku, barcode, stock_quantity, image
- **Create API:** `POST /products/:id/variants/with-admin`
- **Update API:** `PUT /products/:id/variants/with-admin`
- **Delete API:** `DELETE /products/:id/variants/with-admin/:variantId`

---

### 3. Collections / Nhóm Sản Phẩm

**Routes:** `/collections`, `/collections/create`, `/collections/:id/edit`

#### Collection List Page (`CollectionsPage.tsx`)

- **Layout:** `PageWrapper > PaperCustom > CollectionFilterContainer + CollectionTable`
- **Action button:** "Tạo nhóm sản phẩm"
- **Filters** (`CollectionFilterContainer`):
  - Search (text input)
  - Sort by: `title-asc`, `title-desc`, `created_at-desc`, `created_at-asc`
  - Visibility: `VISIBLE` | `INVISIBLE` | `ALL`
  - Tag: `SIGNATURE` | `SPOTLIGHT` | `NORMAL` | `ALL`
- **API:** `GET /collections?limit=X&offset=Y&search=&sort=&is_visible=&tag=`

#### Collection Form (shared `CollectionFormSection.tsx`)

Used by both Create and Edit pages.

- **Layout:** 2-column grid (8/4)
- **Left column:**
  - **Section "Thông tin chung":**
    - Tên nhóm sản phẩm (TextFieldHF, required)
    - Mô tả nhóm sản phẩm (CKEditor 5, Vietnamese locale)
  - **Section "Sản phẩm":**
    - "Thêm Sản Phẩm" button → opens ProductSelectionDialog
    - List of selected products with image, name, remove button
- **Right column:**
  - **Section "Hình đại diện":**
    - Single image upload (ImageInputSection)
  - **Section "Trạng thái":**
    - Checkbox "Hiển thị nhóm sản phẩm"
- **Edit-only features:**
  - Delete button → ConfirmDialog → `DELETE /collections/with-admin/:id`
  - Pre-fill data from `useCollectionDetail(id)`
- **Create API:** `POST /collections/with-admin`
- **Update API:** `PUT /collections/with-admin/:id`
- **Validation:** title required, all others optional

---

### 4. Orders / Đơn Hàng

**Routes:** `/orders`, `/orders/create`

#### Order List Page (`OrdersPage.tsx`)

- **Layout:** `PageWrapper > PaperCustom > OrderFilter + OrderTable`
- **Action button:** "Tạo đơn hàng"
- **Filter:** Keyword search only
- **Table display:** Card layout (NOT data grid), each order shows:
  - **Header row:** Ngày tạo, Thanh toán (payment method), Trạng thái thanh toán, Phí giao hàng, Trạng thái đơn hàng
  - **Body grid (4/8 split):**
    - Left: Thông tin giao hàng (Tên, Địa chỉ, SĐT, Note)
    - Right: Order items (image, product name + attributes, quantity, unit price) + Tổng
- **Pagination:** standard offset-based
- **API:** `GET /orders/with-admin?limit=X&offset=Y&sort=created_at&sort_dir=desc&keyword=`

#### Create Order Page (`CreateOrderPage.tsx`)

- **Layout:** 2-column grid (4/8)
- **Left column:**
  - **Section "Chi tiết khách hàng":**
    - Họ (last_name), Tên (first_name), Địa chỉ, Số điện thoại
  - **Section "Chi tiết đơn hàng":**
    - Loại thanh toán: C.O.D (default, hardcoded display)
    - Số lượng sản phẩm
    - Số lượng biến thể
    - Tạm tính (subtotal, auto-calculated)
    - Khuyến mãi (placeholder, currently 0)
    - Ghi chú (TextFieldHF)
    - Tổng (total, auto-calculated)
- **Right column:**
  - **Section "Sản phẩm":**
    - "Thêm sản phẩm" button → opens ProductSelectionDialog
    - Each selected product → OrderProductSelectedItem
    - Can add/remove variant selections per product
    - Quantity adjustable per variant
- **Submit flow:**
  1. Validate at least 1 variant in order
  2. Collect variant_orders array
  3. Calculate final_price
  4. POST order
- **API:** `POST /orders`
- **Validation (Joi → Zod):**
  - first_name: required
  - last_name: required
  - address: required
  - phone_number: required, VN phone regex `([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})`
  - Others: optional

#### Order Detail Page (STUB)

- Currently commented out entirely
- Route not registered in App.tsx
- Code exists with commented-out sections showing: general info, order items table, bill items, customer info, shipment info, payment method

---

### 5. Menu / Danh Mục

**Route:** `/menus/edit`

#### Menu Page (`MenuPage.tsx`)

- **UI:** Ant Design `Tree` component with drag-and-drop
- **Features:**
  - Load menu tree from API → `useMenus()`
  - Transform flat menu items → nested tree nodes
  - Drag-and-drop reordering
  - Add collection to menu via `CollectionSelectionDialog`
  - Delete selected node
  - Save button (dirty state tracking)
- **Tree node key format:** `{isoTimestamp}__{collection_id}` (separator: `__`)
- **Dumb root node:** `DUMB_LEFT_MENU` (id: "left-menu", name: "Left Menu")
- **API:**
  - GET: `GET /menus`
  - Update: `PUT /menus/with-admin` with `{ menu_items: MenuMutate[] }`
- **Menu mutate structure:**
  ```ts
  interface MenuMutate {
    collection_id: string;
    name: string;
    path: string[]; // tree path
    order_number: number; // position
  }
  ```
- **Utility functions** (`sub-menu.ts`):
  - `transformFlatToNestedData()`
  - `transformMenuItemsToTreeData()`
  - `transformTreeDataToMutateData()`
  - `removeNodeFromTree()`

---

### 6. Global UI

#### Sidebar (`Sidebar.tsx`)

- Width: 240px
- Background: `#0d3064` (dark navy)
- Icon/text color: `#7790b6` (muted blue)
- Active item: white text, `rgba(25,118,210,0.08)` background, scale 1.05
- Hover: scale 1.05
- Menu items (Vietnamese):
  | Label | Icon | Path |
  | ---------------- | ----------------------------- | --------------- |
  | Tổng Quan | AutoGraphOutlinedIcon | / |
  | Đơn Hàng | ShoppingCartOutlinedIcon | /orders |
  | Sản Phẩm | LocalOfferOutlinedIcon | /products |
  | Nhóm sản phẩm | DifferenceOutlinedIcon | /collections |
  | Danh Mục | WidgetsOutlinedIcon | /menus/edit |
  | Khuyến mãi | RedeemOutlinedIcon | /promotions |
  | Báo Cáo | InsertChartOutlinedSharpIcon | /reports |
- **Responsive:**
  - Mobile (< md): temporary Drawer
  - Desktop (≥ md): permanent Drawer

#### Header (`MHeader.tsx`)

- Hamburger menu (mobile only, < md)
- Profile avatar (right side)
- Height: from `HEADER_WIDTH` constant

#### Global Context (`GlobalProvider.tsx`)

- **Snackbar:** `showSnackbar(message, severity)` / `hideSnackbar()`
  - Severity: `success | error | warning | info`
- **Loading overlay:** `showLoading()` / `hideLoading()`
- Both states managed via single `ShowStatus` object

#### Overlay Loading (`OverlayLoading.tsx`)

- Full-screen loading spinner
- Shown during async operations (create, update, upload)

#### Action Snackbar (`ActionSnackbar.tsx`)

- Toast notification with auto-hide
- Controlled via GlobalContext

---

## API Endpoints

### Base URL

```
process.env.REACT_APP_API_END_POINT
```

### Auth Header

```
Authorization: Bearer {jwt_token}
```

Token retrieved from cookie `ADMIN_REQUEST_TOKEN`.

### Endpoints

| Method | Path                                     | Auth | Purpose           |
| ------ | ---------------------------------------- | ---- | ----------------- |
| POST   | `/admins/sign-in`                        | ❌   | Login             |
| POST   | `/admins/sign-up`                        | ❌   | Register          |
| GET    | `/products`                              | ❌   | List products     |
| GET    | `/products/:id`                          | ❌   | Product detail    |
| POST   | `/products/with-admin`                   | ✅   | Create product    |
| PUT    | `/products/with-admin/:id`               | ✅   | Update product    |
| POST   | `/products/:id/variants/with-admin`      | ✅   | Create variant    |
| PUT    | `/products/:id/variants/with-admin`      | ✅   | Update variant    |
| DELETE | `/products/:id/variants/with-admin/:vid` | ✅   | Delete variant    |
| GET    | `/collections`                           | ❌   | List collections  |
| GET    | `/collections/:id`                       | ❌   | Collection detail |
| POST   | `/collections/with-admin`                | ✅   | Create collection |
| PUT    | `/collections/with-admin/:id`            | ✅   | Update collection |
| DELETE | `/collections/with-admin/:id`            | ✅   | Delete collection |
| GET    | `/orders/with-admin`                     | ✅   | List orders       |
| POST   | `/orders`                                | ✅   | Create order      |
| GET    | `/menus`                                 | ❌   | Get menu tree     |
| PUT    | `/menus/with-admin`                      | ✅   | Update menu       |
| GET    | `/vendors`                               | ❌   | List vendors      |
| GET    | `/categories`                            | ❌   | List categories   |
| GET    | `/attributes`                            | ❌   | List attributes   |

### Query Parameters Pattern

```
?limit=10&offset=0&name=search&stock_status=IN_STOCK&is_visible=true&price_sort_dir=ASC
```

### Pagination Response Format

```ts
interface PagingResponse {
  total: number;
  // offset-based pagination
}

interface QueryDataResponse<T> {
  items: T[];
  paging: PagingResponse;
}
```

---

## Data Models

### ProductResponse

```ts
interface ProductResponse {
  id: string;
  name: string;
  description: string; // HTML from CKEditor
  quote: string;
  type: number;
  is_visible: boolean;
  vendor_id: string;
  vendor: VendorResponse;
  category_id: string;
  category: CategoryResponse;
  variants: VariantResponse[];
  images: ImageResponse[] | null;
  collection_ids: string[];
  created_at: string;
  updated_at: string;
}
```

### VariantResponse

```ts
interface VariantResponse {
  id: string;
  product_id: string;
  barcode: string;
  sku: string;
  retail_price: number;
  cost_price: number;
  stock_quantity: number;
  image: ImageResponse | null;
  image_id: string;
  attributes: AttributeValueResponse[];
  created_at: string;
  updated_at: string;
}

interface AttributeValueResponse {
  id: string;
  name: string; // attribute name (e.g., "Color")
  description: string;
  value: string; // attribute value (e.g., "Red")
  created_at: string;
  updated_at: string;
}
```

### CollectionResponse

```ts
interface CollectionResponse {
  id: string;
  title: string;
  description: string;
  is_visible: boolean;
  tag: "SIGNATURE" | "SPOTLIGHT" | "NORMAL" | "ALL";
  image_id: string | null;
  image: ImageResponse | null;
  created_at: string;
  updated_at: string;
}
```

### OrderResponse

```ts
interface OrderResponse {
  order_id: string;
  phone_number: string;
  last_name: string;
  first_name: string;
  address: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  additional_price: number;
  shipping_price: number;
  final_price: number;
  note: string;
  order_item: Array<{
    product_id: string;
    product_name: string;
    attribute_value: string[];
    image: ImageResponse;
    quantity: number;
    unique_price: number;
    price: number;
  }>;
  created_at: string;
  updated_at: string;
}
```

### ImageResponse

```ts
interface ImageResponse {
  id: string;
  file_name: string;
  url: string; // Cloudinary URL
  alt: string;
  extension: string;
  size: number;
  created_at: string;
  updated_at: string;
}
```

### VendorResponse / CategoryResponse

```ts
interface VendorResponse {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface CategoryResponse {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

### MenuDataResponse

```ts
interface MenuDataResponse {
  menu_items: Array<{
    collection: CollectionResponse;
    collection_id: string;
    id: string;
    name: string;
    order_number: number;
    path: string[];
  }>;
}

interface SubMenuItem {
  collection_id: string;
  collection: CollectionResponse | null;
  id: string;
  name: string;
  path: string[];
  sub_menus: SubMenuItem[] | null;
}
```

### Form Types

```ts
interface LoginForm {
  email: string;
  password: string;
}

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface ProductForm {
  vendor_id: string;
  category_id: string;
  collection_ids: string[];
  images: { url: string }[];
  variants: ProductVariantForm[];
  name: string;
  description: string;
  quote: string;
  type: number;
  is_visible: boolean;
}

interface ProductVariantForm {
  attribute_values: { attribute_id: string; value: string }[];
  cost_price: number;
  retail_price: number;
  sku: string;
  barcode: string;
  stock_quantity: number;
  image: { url: string } | null;
}

interface CollectionForm {
  product_ids?: string[];
  image_url?: string;
  title: string;
  description?: string;
  is_visible: boolean;
  tag: CollectionTagEnum;
}

interface OrderForm {
  variant_orders: { variant_id: string; quantity: number }[];
  phone_number: string;
  last_name: string;
  first_name: string;
  address: string;
  payment_method: string;
  additional_price: number;
  shipping_price: number;
  final_price: number;
  note: string;
}
```

### Enums

```ts
enum OrderStatusEnum {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  CANCELLED = "CANCELLED",
  INVOICED = "INVOICED",
}

enum ProductStockStatusEnum {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

enum CollectionTagEnum {
  SIGNATURE = "SIGNATURE",
  SPOTLIGHT = "SPOTLIGHT",
  NORMAL = "NORMAL",
  ALL = "ALL",
}

enum PaymentMethodEnum {
  CASH = "CASH",
  CREDIT_AND_DEBIT = "CREDIT_AND_DEBIT",
  MOBILE_WALLET = "MOBILE_WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}
```

---

## Patterns & Conventions

| Pattern         | Implementation                                                                               |
| --------------- | -------------------------------------------------------------------------------------------- |
| Data fetching   | Custom hooks wrapping `useQuery` / `useMutation` from TanStack                               |
| Form            | React Hook Form + Joi resolver (→ Zod resolver)                                              |
| URL state       | `useSearchURLProducts`, `useSearchURLOrders` (filter synced to URL params)                   |
| Pagination      | Custom `usePaging` hook, `TablePaginationWrapper`                                            |
| Global state    | `GlobalContext` (snackbar + loading), no Redux                                               |
| Image upload    | Async upload to Cloudinary via `useUploadImage` hook                                         |
| Auth token      | Cookie (3-day expiry) + localStorage profile                                                 |
| Debounce search | `useDebounce` hook                                                                           |
| Rich text       | CKEditor 5 Classic (Vietnamese locale `vi`)                                                  |
| Currency format | `numberToCurrency()` using `toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })` |
| Date format     | `convertToDate()` using `toLocaleDateString('vi-VN')`                                        |
| Image resize    | Cloudinary URL transform: `w_{width}/q_{quality}/` injected into URL                         |
| Locale          | Vietnamese (`vi-VN`) throughout                                                              |

### Hooks List (to recreate)

```
// Data hooks
useProducts          useProductDetail      useCreateProduct
useUpdateProduct     useCategories         useVendors
useAttributes        useCreateProductVariant
useUpdateProductVariant  useDeleteProductVariant
useCollections       useCollectionDetail   useCreateCollection
useUpdateCollection  useDeleteCollection
useOrders            useCreateOrder        useOrderDetail (stub)
useMenus             useUpdateMenus
useUploadImage       useMutationLogin      useMutationSignUp
useAdminProfile

// UI hooks
useDebounce          useDocumentTitle      usePaging
useGetQueryUtil      useGetQueryPagination
useSearchURLProducts useSearchURLOrders    useSearchURLCollections
useShowSnackbar      useShowOverlayLoading
useProvinces         useDistricts          useWards (location data)
useVariantsByProductList
```

---

## Unimplemented / Stub Features

These have TypeScript types, forms, and/or validation schemas defined but **no active pages or routes:**

| Feature      | Types Exist | Form Exists | Validation Exists | Route Exists       |
| ------------ | ----------- | ----------- | ----------------- | ------------------ |
| Discounts    | ✅          | ✅          | ✅                | ❌                 |
| Vouchers     | ✅          | ✅          | ✅                | ❌                 |
| Posts/Blog   | ✅          | ✅          | ✅                | ❌                 |
| HomePage CMS | ✅          | ✅          | ✅                | ❌                 |
| Order Detail | ✅          | —           | —                 | ❌ (commented out) |
| Dashboard    | —           | —           | —                 | ❌ (commented out) |
| Reports      | —           | —           | —                 | ❌ (sidebar only)  |
| Promotions   | —           | —           | —                 | ❌ (sidebar only)  |

---

## Implementation Plan

### Phase 0 — Project Bootstrap

```bash
# Create new Vite project
pnpm create vite@latest apollo-admin --template react-ts
cd apollo-admin

# Install Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Init shadcn/ui
pnpm dlx shadcn@latest init

# Install shadcn components
pnpm dlx shadcn@latest add \
  button input label checkbox select \
  dialog alert-dialog toast table badge avatar \
  separator form textarea popover command \
  card dropdown-menu sheet skeleton tabs

# Core dependencies
pnpm add react-router-dom axios @tanstack/react-query
pnpm add react-hook-form @hookform/resolvers zod
pnpm add class-variance-authority clsx tailwind-merge lucide-react

# Rich text + date + utils
pnpm add @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
pnpm add dayjs react-number-format
pnpm add antd    # for Tree component only
pnpm add sonner  # toast library for shadcn

# Dev deps
pnpm add -D @types/node
```

### Phase 1 — Foundation (Auth + Layout)

**Files to create:**

```
src/
├── lib/
│   ├── utils.ts              # cn() helper (from shadcn)
│   ├── axios.ts              # axios instance + base URL config
│   └── queryClient.ts        # TanStack QueryClient
│
├── constants/
│   ├── routes.ts             # RoutePage enum
│   ├── user.ts               # Storage keys
│   └── common.ts             # All enums
│
├── utils/
│   ├── cookie.ts             # setCookie, getCookie, removeCookie
│   ├── service.ts            # getData, postData, putData, deleteData
│   └── common.ts             # numberToCurrency, convertToDate, reduceUrlImage
│
├── types/
│   ├── services.ts           # All API response types
│   ├── forms.ts              # All form types
│   └── views.ts              # UI types
│
├── schemas/                  # NEW: Zod validation schemas
│   ├── auth.ts               # loginSchema, signUpSchema
│   ├── product.ts            # productSchema
│   ├── collection.ts         # collectionSchema
│   └── order.ts              # orderSchema
│
├── providers/
│   └── GlobalProvider.tsx    # Context: toast + loading (using sonner)
│
├── hooks/
│   ├── useAdminProfile.ts
│   ├── useDebounce.ts
│   └── ...
│
├── layouts/
│   ├── RootLayout.tsx        # Protected wrapper
│   ├── Sidebar.tsx           # bg-sidebar, w-60
│   ├── SidebarItem.tsx       # NavLink active states
│   └── Header.tsx            # Hamburger + ProfileAvatar
│
├── pages/
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   └── NotFoundPage.tsx
│
└── App.tsx                   # Router + QueryProvider + GlobalProvider
```

### Phase 2 — Products Module

```
src/
├── hooks/
│   ├── useProducts.ts
│   ├── useProductDetail.ts
│   ├── useCreateProduct.ts
│   ├── useUpdateProduct.ts
│   ├── useCategories.ts
│   ├── useVendors.ts
│   ├── useAttributes.ts
│   ├── useCreateProductVariant.ts
│   ├── useUpdateProductVariant.ts
│   ├── useDeleteProductVariant.ts
│   ├── useUploadImage.ts
│   └── useSearchURLProducts.ts
│
├── components/
│   ├── shared/
│   │   ├── PageWrapper.tsx
│   │   ├── PaperSection.tsx       # Card-based section wrapper
│   │   ├── ActionButtons.tsx
│   │   ├── DataTable.tsx          # TanStack Table + shadcn Table
│   │   ├── TablePagination.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── PictureWall.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ProductFilter.tsx
│   │   ├── ProductVariantSection.tsx
│   │   └── CreateVariantSection.tsx
│   │
│   └── rhf/
│       ├── InputHF.tsx            # shadcn Input
│       ├── ComboboxHF.tsx         # shadcn Command + Popover
│       ├── CheckboxHF.tsx
│       ├── SelectHF.tsx
│       └── DatePickerHF.tsx
│
└── pages/products/
    ├── ProductsPage.tsx
    ├── CreateProductPage.tsx
    ├── EditProductPage.tsx
    ├── CreateProductVariantPage.tsx
    └── EditProductVariantPage.tsx
```

### Phase 3 — Collections Module

```
src/
├── hooks/
│   ├── useCollections.ts
│   ├── useCollectionDetail.ts
│   ├── useCreateCollection.ts
│   ├── useUpdateCollection.ts
│   ├── useDeleteCollection.ts
│   └── useSearchURLCollections.ts
│
├── components/collections/
│   ├── CollectionTable.tsx
│   ├── CollectionFilter.tsx
│   └── CollectionFormSection.tsx
│
└── pages/collections/
    ├── CollectionsPage.tsx
    ├── CreateCollectionPage.tsx
    └── EditCollectionPage.tsx
```

### Phase 4 — Orders Module

```
src/
├── hooks/
│   ├── useOrders.ts
│   ├── useCreateOrder.ts
│   └── useSearchURLOrders.ts
│
├── components/orders/
│   ├── OrderCard.tsx              # Card layout per order
│   ├── OrderFilter.tsx
│   └── OrderProductSelectedItem.tsx
│
└── pages/orders/
    ├── OrdersPage.tsx
    └── CreateOrderPage.tsx
```

### Phase 5 — Menu Module

```
src/
├── hooks/
│   ├── useMenus.ts
│   └── useUpdateMenus.ts
│
├── utils/
│   └── sub-menu.ts            # Tree transform utilities (copy)
│
└── pages/menus/
    └── MenuPage.tsx           # Ant Design Tree (keep as-is)
```

### Phase 6 — Dialogs (shared across modules)

```
src/components/dialogs/
├── ProductSelectionDialog.tsx    # shadcn Dialog + DataTable + search
├── CollectionSelectionDialog.tsx # shadcn Dialog + list + search
└── ConfirmDialog.tsx            # shadcn AlertDialog
```

### Phase 7 — Global UI Polish

- **Toast/Snackbar:** Replace MUI Snackbar with `sonner`
- **Loading overlay:** Custom Tailwind fixed overlay + spinner
- **ProfileAvatar:** shadcn `Avatar` + `DropdownMenu` (logout action)
- **Responsive sidebar:** shadcn `Sheet` (mobile) + fixed sidebar (desktop)
- **CKEditor style:** Keep `.ck-editor__editable_inline { min-height: 400px }`

---

## Component Mapping (MUI → shadcn)

| MUI Component        | shadcn/Tailwind Equivalent                       |
| -------------------- | ------------------------------------------------ |
| `TextField`          | `Input` + `Label`                                |
| `Autocomplete`       | `Command` + `Popover` (Combobox pattern)         |
| `DataGrid`           | TanStack Table + shadcn `Table`                  |
| `Dialog`             | `Dialog`                                         |
| `Snackbar` + `Alert` | `sonner` Toast                                   |
| `Checkbox`           | `Checkbox`                                       |
| `Button`             | `Button`                                         |
| `Paper`              | `Card` or `div.bg-white.rounded.shadow-sm`       |
| `Avatar`             | `Avatar`                                         |
| `Drawer`             | `Sheet` (mobile) / fixed sidebar (desktop)       |
| `Select`             | `Select`                                         |
| `Grid container`     | `div.grid.grid-cols-12` or flexbox               |
| `Typography`         | Tailwind text utilities (`text-sm`, `font-bold`) |
| `Divider`            | `Separator`                                      |
| `Skeleton`           | `Skeleton`                                       |
| `IconButton`         | `Button variant="ghost" size="icon"`             |
| `FormControlLabel`   | Custom flex label with `Checkbox`/`Radio`        |
| `Stack`              | `div.flex.flex-col.gap-*`                        |
| `Box`                | `div` with Tailwind classes                      |
| `Container`          | `div.max-w-screen-lg.mx-auto`                    |
| `Toolbar`            | `div.h-16` (spacer)                              |

---

## Key Implementation Notes

### Auth Flow (copy exact)

```ts
// Login success handler
setCookie({ key: ADMIN_REQUEST_TOKEN_KEY, value: JSON.stringify(data.access_token), dayOffset: 3 });
localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
navigate("/");

// Protected route check (useAdminProfile)
const token = getCookie(ADMIN_REQUEST_TOKEN_KEY); // from cookie
const profile = JSON.parse(localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY) || "{}");
const isLogin = token !== "" && Object.keys(profile).length >= 0;
```

### Image Upload (Cloudinary)

```ts
// useUploadImage hook pattern:
// POST to Cloudinary upload URL
// Returns: { data: { secure_url: string } }
// Used in: product images (multiple), collection image (single), variant image
```

### Cloudinary URL Transformation

```ts
const reduceUrlImage = ({ originUrl, width = 1920, quality = 45 }) => {
  if (!originUrl) return "/images/nothing-image.png";
  const [hostUrl, pathUrl] = originUrl.split("upload/");
  return hostUrl + `upload/w_${width}/q_${quality}/` + pathUrl;
};
```

### Currency Formatting

```ts
const numberToCurrency = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
```

### Sidebar Active State (replicate in Tailwind)

```tsx
// SidebarItem with NavLink
<NavLink
  to={path}
  className={({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 text-sidebar-text transition-transform origin-left',
      isActive && 'text-white bg-primary/10 scale-105',
      'hover:scale-105'
    )
  }
>
```

### Environment Variables (rename for Vite)

```bash
# CRA format (old)
REACT_APP_API_END_POINT=https://api.example.com

# Vite format (new)
VITE_API_ENDPOINT=https://api.example.com
# Access: import.meta.env.VITE_API_ENDPOINT
```

---

## Form Validation Schemas (Zod)

### Login Schema

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email chưa đúng định dạng"),
  password: z.string().min(6, "Mật khẩu nên được đặt từ 6 kí tự trở lên"),
});
```

### Sign Up Schema

```ts
export const signUpSchema = z
  .object({
    name: z.string().min(1, "Tên không được để trống"),
    email: z.string().min(1, "Email không được để trống").email("Email chưa đúng định dạng"),
    password: z.string().min(6, "Mật khẩu nên được đặt từ 6 kí tự trở lên"),
    confirm_password: z.string().min(1, "Mật khẩu nhập lại không được để trống"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu nhập lại chưa trùng khớp",
    path: ["confirm_password"],
  });
```

### Product Schema

```ts
export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  category_id: z.string().min(1, "Loại sản phẩm không được để trống"),
  vendor_id: z.string().optional(),
  description: z.string().optional(),
  collection_ids: z.array(z.string()).optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
  is_visible: z.boolean().optional(),
  quote: z.string().optional(),
  type: z.number().optional(),
  variants: z.array(z.any()).optional(),
});
```

### Collection Schema

```ts
export const collectionSchema = z.object({
  title: z.string().min(1, "Tên nhóm sản phẩm không được để trống"),
  product_ids: z.array(z.string()).optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  is_visible: z.boolean().optional(),
  tag: z.enum(["SIGNATURE", "SPOTLIGHT", "NORMAL", "ALL"]).optional(),
});
```

### Order Schema

```ts
export const orderSchema = z.object({
  first_name: z.string().min(1, "Tên không được để trống"),
  last_name: z.string().min(1, "Họ không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phone_number: z
    .string()
    .min(1, "SĐT không được để trống")
    .regex(/([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, "SĐT không hợp lệ"),
  variant_orders: z
    .array(
      z.object({
        variant_id: z.string(),
        quantity: z.number(),
      }),
    )
    .optional(),
  note: z.string().optional(),
  additional_price: z.number().optional(),
  final_price: z.number().optional(),
  payment_method: z.string().optional(),
  shipping_price: z.number().optional(),
});
```

---

## File Count Estimate

| Module                             | Files   |
| ---------------------------------- | ------- |
| Foundation (layout + auth + utils) | ~20     |
| Products                           | ~15     |
| Collections                        | ~10     |
| Orders                             | ~10     |
| Menu                               | ~5      |
| Shared components                  | ~15     |
| shadcn UI components (generated)   | ~15     |
| **Total**                          | **~90** |

---

_This document serves as the complete reference for rebuilding the Apollo Admin Dashboard. All features, types, API contracts, color tokens, and implementation patterns are documented above._
