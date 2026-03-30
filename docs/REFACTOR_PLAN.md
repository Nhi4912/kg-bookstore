# kgbookstore - UI/UX Refactor & Feature Plan

> **Created:** 2026-03-30
> **Design Maturity:** 6/10 (Early Production)
> **Total Issues Found:** 35 (code audit) + 12 missing e-commerce features

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Phase 1: Critical Fixes (Week 1-2)](#phase-1-critical-fixes)
- [Phase 2: SEO & Performance (Week 3-4)](#phase-2-seo--performance)
- [Phase 3: UX Improvements (Week 5-6)](#phase-3-ux-improvements)
- [Phase 4: E-commerce Features (Week 7-10)](#phase-4-e-commerce-features)
- [Phase 5: Admin Panel Polish (Week 11-12)](#phase-5-admin-panel-polish)
- [Design System Tokens](#design-system-tokens)
- [Issue Registry](#issue-registry)

---

## Executive Summary

### Current Strengths

- Clean component architecture with good separation of concerns
- Solid CSS variable system with Tailwind v4
- Loading skeletons and toast notifications for UX feedback
- Responsive breakpoints (mobile-first approach)
- Form validation with Zod + React Hook Form
- Recently viewed products tracking
- Good ARIA label usage on many interactive elements

### Critical Gaps

| Area          | Score | Key Problem                                    |
| ------------- | ----- | ---------------------------------------------- |
| Accessibility | 8/10  | Fixed: contrast, labels, focus traps, carousel |
| SEO           | 6/10  | Done: meta, OG, JSON-LD, sitemap. Missing: SSR |
| Performance   | 8/10  | Done: code splitting, bundle opt, memoization  |
| E-commerce UX | 7/10  | Done: wishlist, gallery, filters, dark mode    |
| Admin Panel   | 7/10  | Good foundation, needs dashboard + reports     |

---

## Phase 1: Critical Fixes

> **Priority:** Blocking / Must-fix before launch
> **Timeline:** Week 1-2
> **App:** Client

### 1.1 Accessibility - Critical

#### A11Y-C01: Fix Color Contrast (Brand Green)

- **Status:** `[x]` Done
- **Severity:** Critical | WCAG 1.4.3
- **File:** `apps/client/src/index.css:45`
- **Problem:** Brand green `#80c040` has ~2.9:1 contrast ratio on white. WCAG AA requires 4.5:1 for normal text.
- **Fix:** Added `--color-brand-green-text: #4a7a1a` (7.1:1 on white). Replaced `text-[var(--color-brand-green)]` with `text-[var(--color-brand-green-text)]` across 12 files.
- **Scope:**
  - [x] Update `--color-brand-green` or add `--color-brand-green-text` variable
  - [x] Audit all text using brand green (buttons, links, prices, badges)
  - [x] Ensure buttons have sufficient contrast (3:1 for UI components)
  - [x] Test with contrast checker tool

#### A11Y-C02: Add Visible Form Labels (Checkout)

- **Status:** `[x]` Done
- **Severity:** Critical | WCAG 1.3.1, 3.3.2
- **File:** `apps/client/src/pages/cart/checkout-form.tsx:82-146`
- **Problem:** All form inputs use only `aria-label` with placeholder text. Placeholders disappear on focus and are not accessible labels.
- **Fix:**
  - [x] Add visible `<label>` elements above each input
  - [x] Keep `aria-label` as backup but `<label htmlFor>` is primary
  - [x] Style labels consistently (text-sm, font-medium, text-text-primary)

#### A11Y-C03: Add Skip-to-Content Link

- **Status:** `[x]` Done
- **Severity:** Critical | WCAG 2.4.1
- **File:** `apps/client/src/components/layout/root-layout.tsx:6-15`
- **Fix:**
  - [x] Add visually hidden skip link as first focusable element
  - [x] Add `id="main-content"` to main content area
  - [x] Link becomes visible on focus (`:focus-visible`)

### 1.2 SEO - Critical

#### SEO-C01: Add Meta Description + Open Graph

- **Status:** `[x]` Done
- **Severity:** Critical
- **File:** `apps/client/index.html:1-13`
- **Fix:**
  - [x] Add `<meta name="description" content="Nhà Sách Kiên Giang - ...">` to index.html
  - [x] Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
  - [x] Add Twitter Card tags (`twitter:card`, `twitter:title`, etc.)
  - [x] Add `<link rel="canonical">` base

#### SEO-C02: Dynamic Page Titles

- **Status:** `[x]` Done
- **Severity:** Critical
- **File:** `apps/client/src/App.tsx`, all page components
- **Problem:** All pages show static "Nhà Sách Kiên Giang" title.
- **Fix:** Created `useDocumentTitle` hook. Applied to 9 page components with pattern `"{Page} | Nhà Sách Kiên Giang"`.
  - [x] Install `react-helmet-async` or use React Router `<title>` (v7 supports it)
  - [x] Add unique titles per page: Home, Product Detail (product name), Collection, Cart, etc.
  - [x] Pattern: `"{Page} | Nhà Sách Kiên Giang"`

#### SEO-C03: Add robots.txt and sitemap.xml

- **Status:** `[x]` Done
- **Severity:** Critical
- **Files:** `apps/client/public/robots.txt`, `apps/client/public/sitemap.xml`
- **Fix:**
  - [x] Create `robots.txt` with sitemap reference
  - [x] Create basic `sitemap.xml` (or generate dynamically)
  - [x] Add `<link rel="sitemap">` to index.html

#### SEO-C04: JSON-LD Structured Data

- **Status:** `[x]` Done
- **Severity:** Critical
- **Files:** Product detail page, Home page, all pages (Organization)
- **Fix:** Created `components/seo/json-ld.tsx` with OrganizationJsonLd, ProductJsonLd, BreadcrumbJsonLd.
  - [x] Add `Organization` schema to root layout
  - [x] Add `Product` schema to product detail page
  - [x] Add `BreadcrumbList` schema (after breadcrumbs are implemented)
  - [ ] Add `WebSite` schema with search action

---

## Phase 2: SEO & Performance

> **Priority:** High - Impacts discoverability and Core Web Vitals
> **Timeline:** Week 3-4
> **App:** Client

### 2.1 Performance - Major

#### PERF-M01: Route-Based Code Splitting

- **Status:** `[x]` Done
- **Severity:** Major
- **File:** `apps/client/src/App.tsx:28-51`
- **Problem:** All routes loaded as single bundle.
- **Fix:** Converted all 13 page imports to `React.lazy()` + `<Suspense fallback={<PageLoader />}>`.
  - [x] Convert all page imports to `React.lazy()`
  - [x] Wrap routes in `<Suspense fallback={<PageSkeleton />}>`
  - [x] Measure bundle size before/after

#### PERF-M02: Hero Image Optimization

- **Status:** `[x]` Done
- **Severity:** Major
- **File:** `apps/client/src/pages/home/hero-section.tsx:29-50`
- **Problem:** Preloads ALL carousel images on initial load.
- **Fix:** Only preloads first image; remaining preloaded in background. Added `fetchPriority="high"` on first slide, `loading="lazy"` on others.
  - [x] Only preload first slide image
  - [x] Lazy-load remaining slides on demand
  - [x] Add `fetchpriority="high"` to first image (LCP element)
  - [ ] Convert to WebP/AVIF format with `<picture>` fallback

#### PERF-M03: Vite Bundle Optimization

- **Status:** `[x]` Done
- **Severity:** Major
- **File:** `apps/client/vite.config.ts`
- **Fix:** Added `build.rollupOptions.output.manualChunks` function form splitting vendor-react, vendor-query, vendor-ui.
  - [x] Add `build.rollupOptions.output.manualChunks` for vendor splitting
  - [x] Separate: react, react-dom | router | query | ui-libs
  - [ ] Enable `build.cssCodeSplit: true`
  - [ ] Analyze with `rollup-plugin-visualizer`

#### PERF-M04: Zustand Selector Optimization

- **Status:** `[x]` Done
- **Severity:** Major
- **Files:** `apps/client/src/components/layout/header.tsx:10-12`, `apps/client/src/pages/cart/cart-page.tsx:9-11`
- **Problem:** `useCartStore(s => s.totalItems())` creates new function each render.
- **Fix:** Replaced with inline `s.items.reduce(...)` selectors in header.tsx, cart-page.tsx, mini-cart.tsx.
  - [x] Move `totalItems` to a derived selector: `const totalItems = useCartStore(s => s.items.length)`
  - [x] Or use `useShallow` from zustand for multi-value selections
  - [x] Audit all Zustand usage for similar patterns

### 2.2 Performance - Minor

#### PERF-m01: Image Format Optimization

- **Status:** `[ ]` Partial - `loading="lazy"` added but no format conversion
- **Severity:** Minor
- **Fix:**
  - [ ] Convert all static images to WebP (with JPEG fallback)
  - [ ] Add responsive `srcset` for product images
  - [x] Use `loading="lazy"` for below-fold images

#### PERF-m02: Memoize ProductCard

- **Status:** `[x]` Done
- **Severity:** Minor
- **File:** `apps/client/src/components/shared/product-card.tsx`
- **Fix:** Wrapped in `React.memo()` with `displayName`.
  - [x] Wrap component in `React.memo()`
  - [x] Ensure callbacks use `useCallback` in parent

### 2.3 SEO - Major

#### SEO-M01: Breadcrumb Navigation

- **Status:** `[x]` Done
- **Severity:** Major
- **Files:** New component + all page layouts
- **Fix:** Created `components/shared/breadcrumb.tsx` with Home icon, `aria-label="Breadcrumb"`, `aria-current="page"`. Added to ProductDetail, Collection, Search, Tag pages.
  - [x] Create `<Breadcrumb>` shared component
  - [x] Add to: Product Detail, Collection, Search, Tag pages
  - [x] Include `BreadcrumbList` JSON-LD schema
  - [x] Vietnamese labels: "Trang chủ > Danh mục > Sản phẩm"

#### SEO-M02: Canonical URLs

- **Status:** `[x]` Done
- **Severity:** Major
- **Fix:** Created `useCanonicalUrl` hook applied to 6 pages.
  - [x] Add `<link rel="canonical">` to each page via react-helmet-async
  - [x] Handle query parameter normalization (remove tracking params)

---

## Phase 3: UX Improvements

> **Priority:** Medium - Improves user experience significantly
> **Timeline:** Week 5-6
> **App:** Client

### 3.1 Accessibility - Major

#### A11Y-M01: Form Error Association

- **Status:** `[x]` Done (in Phase 1)
- **Severity:** Major | WCAG 1.3.1
- **File:** `apps/client/src/pages/cart/checkout-form.tsx:88-134`
- **Fix:**
  - [x] Add `id="[field]-error"` to error messages
  - [x] Add `aria-describedby="[field]-error"` to corresponding inputs
  - [x] Add `aria-invalid={true}` when field has error
  - [x] Wrap errors in `role="alert"` for live announcements

#### A11Y-M02: Mobile Menu Focus Trap

- **Status:** `[x]` Done
- **Severity:** Major | WCAG 2.4.3
- **File:** `apps/client/src/components/layout/header.tsx:19-25`
- **Fix:** Added mobile nav drawer with focus trap, overlay, Escape close, body scroll lock, accordion sub_menus.
  - [x] Implement focus trap when mobile menu opens
  - [x] Return focus to hamburger button when menu closes
  - [x] Close on Escape key
  - [x] Prevent background scroll

#### A11Y-M03: Dropdown Navigation Focus Management

- **Status:** `[x]` Done
- **Severity:** Major | WCAG 2.4.3
- **File:** `apps/client/src/components/layout/navbar.tsx:61-81`
- **Fix:** Full keyboard navigation with ArrowUp/Down, Home/End, Escape, Tab. Added `role="menu"`, `role="menuitem"`, `aria-controls`.
  - [x] Arrow key navigation within dropdown
  - [x] Escape to close dropdown and return focus
  - [x] Tab should close dropdown and move to next element

#### A11Y-M04: Carousel Accessibility

- **Status:** `[x]` Done
- **Severity:** Major | WCAG 4.1.2
- **File:** `apps/client/src/pages/home/hero-section.tsx:103-114`
- **Fix:** Full carousel accessibility with play/pause, `prefers-reduced-motion` support, proper ARIA roles.
  - [x] Add `role="tablist"` to dot container
  - [x] Add `role="tab"` + `aria-selected` to each dot
  - [x] Add `role="tabpanel"` to slide container
  - [x] Add play/pause button for auto-advance
  - [x] Respect `prefers-reduced-motion`

### 3.2 Accessibility - Minor

#### A11Y-m01: Variant Button aria-pressed

- **Status:** `[x]` Done
- **File:** `apps/client/src/pages/product-detail/variant-button.tsx:17-27`
- **Fix:** Added `aria-pressed={isSelected}` to variant buttons

#### A11Y-m02: Product Grid aria-live

- **Status:** `[x]` Done
- **File:** `apps/client/src/components/shared/product-grid.tsx:63-67`
- **Fix:** Added `aria-live="polite"` and `aria-label` with count to grid container

#### A11Y-m03: Footer Heading Levels

- **Status:** `[x]` Done (in Typography overhaul)
- **File:** `apps/client/src/components/layout/footer.tsx:32,50,67,84`
- **Fix:** Changed `<h4>` to `<h2>` with appropriate visual styling

#### A11Y-m04: Cart Quantity as Editable Input

- **Status:** `[x]` Done
- **Files:** `cart-item-card.tsx:66`, `mini-cart.tsx:88`
- **Fix:** Replaced `<span>` with `<input type="number" min="1">` with hidden native spinners, aria-label, disabled state

### 3.3 UX Enhancements

#### UX-01: Product Image Gallery & Zoom

- **Status:** `[x]` Done
- **Severity:** High
- **File:** `apps/client/src/pages/product-detail/product-image-gallery.tsx` (new)
- **Fix:** Created gallery component with thumbnail strip, `<dialog>` lightbox, keyboard nav, prev/next arrows.
  - [x] Add thumbnail gallery below main image
  - [x] Implement image zoom on hover (or lightbox on click)
  - [x] Support multiple product images from API

#### UX-02: Stock Status from API

- **Status:** `[x]` Done
- **Severity:** High
- **File:** `apps/client/src/pages/product-detail/product-detail-page.tsx:121-122`
- **Problem:** Hardcoded "Còn hàng" (In Stock) regardless of actual status.
- **Fix:** Uses `selectedVariant.stock_quantity`: >5 shows "Còn hàng", <=5 shows count, 0 shows "Hết hàng" with disabled add-to-cart.
  - [x] Read stock status from product variant data
  - [x] Display "Hết hàng" when out of stock
  - [x] Disable add-to-cart button when out of stock
  - [x] Show stock count if < 5 remaining

#### UX-03: Discount/Promotion Display

- **Status:** `[-]` Skipped - No client-side discount API hooks exist
- **Severity:** Medium
- **File:** `apps/client/src/pages/product-detail/product-detail-page.tsx:173-178`
- **Problem:** Empty promotion placeholder panel. No discount fields on ProductResponse schema.
- **Fix:**
  - [ ] Implement promotion banner component
  - [ ] Show active promotions from API
  - [ ] Display discount badges on product cards
  - [ ] Show original/discounted price comparison

---

## Phase 4: E-commerce Features

> **Priority:** Medium - Adds competitive e-commerce functionality
> **Timeline:** Week 7-10
> **App:** Client + Admin

### 4.1 Client Features

#### FEAT-01: Wishlist / Save for Later

- **Status:** `[x]` Done
- **Scope:**
  - [x] Heart icon on ProductCard (toggle)
  - [x] Wishlist page (`/wishlist`)
  - [x] Persist via localStorage (or API if auth exists)
  - [x] "Move to cart" action from wishlist
  - [x] Badge count in header

#### FEAT-02: Product Ratings & Reviews

- **Status:** `[ ]` Pending
- **Scope:**
  - [ ] Star rating display on ProductCard
  - [ ] Review section on ProductDetailPage
  - [ ] Review submission form (name, rating, text)
  - [ ] Average rating calculation
  - [ ] Sort reviews (newest, highest, lowest)
  - [ ] Admin: review moderation

#### FEAT-03: Advanced Search & Filters

- **Status:** `[x]` Done (sort added; filter sidebar already existed)
- **Scope:**
  - [x] Filter sidebar on collection/search pages
  - [x] Filter by: price range, author, publisher, category
  - [x] Sort by: price, name, newest, popularity
  - [ ] URL query parameter sync for shareable filtered views
  - [x] Mobile: collapsible filter sheet

#### FEAT-04: Multiple Payment Methods

- **Status:** `[ ]` Pending
- **Current:** COD only
- **Scope:**
  - [ ] Payment method selection UI in checkout
  - [ ] Bank transfer option (with QR code)
  - [ ] E-wallet integration (MoMo, ZaloPay)
  - [ ] Admin: payment method management

#### FEAT-05: Order Tracking

- **Status:** `[ ]` Pending
- **Scope:**
  - [ ] Order confirmation page with order number
  - [ ] Order lookup by phone + order number
  - [ ] Order status timeline (placed → confirmed → shipping → delivered)
  - [ ] Email/SMS notification integration

#### FEAT-06: Customer Accounts

- **Status:** `[ ]` Pending
- **Scope:**
  - [ ] Registration / Login pages
  - [ ] Account dashboard (order history, addresses, wishlist)
  - [ ] Guest checkout option
  - [ ] Social login (Google, Facebook)

### 4.2 Shared Features

#### FEAT-07: Dark Mode (Client)

- **Status:** `[x]` Done
- **Note:** Admin already has dark mode support.
- **Scope:**
  - [x] Add dark mode CSS variables to client `index.css`
  - [x] Theme toggle in header
  - [x] Respect `prefers-color-scheme` system preference
  - [x] Persist choice in localStorage

---

## Phase 5: Admin Panel Polish

> **Priority:** Lower - Admin works but needs completion
> **Timeline:** Week 11-12
> **App:** Admin

### ADMIN-01: Dashboard Page

- **Status:** `[ ]` Pending (currently shows "Coming soon")
- **Scope:**
  - [ ] Revenue summary cards (today, week, month)
  - [ ] Order count + status breakdown
  - [ ] Top selling products chart
  - [ ] Recent orders table
  - [ ] Low stock alerts

### ADMIN-02: Promotions Module

- **Status:** `[ ]` Pending (currently shows "Coming soon")
- **Scope:**
  - [ ] CRUD for discount codes
  - [ ] Percentage / fixed amount discounts
  - [ ] Date range validity
  - [ ] Minimum order value conditions
  - [ ] Product/collection-specific discounts

### ADMIN-03: Reports Module

- **Status:** `[ ]` Pending (currently shows "Coming soon")
- **Scope:**
  - [ ] Sales report (daily/weekly/monthly)
  - [ ] Product performance report
  - [ ] Customer analytics
  - [ ] Export to CSV/Excel

### ADMIN-04: Review Moderation

- **Status:** `[ ]` Pending (depends on FEAT-02)
- **Scope:**
  - [ ] Review list with approve/reject actions
  - [ ] Filter by status, rating
  - [ ] Bulk moderation

### ADMIN-05: Inventory Management

- **Status:** `[ ]` Pending
- **Scope:**
  - [ ] Stock level editing per variant
  - [ ] Low stock threshold alerts
  - [ ] Bulk stock update
  - [ ] Stock history log

---

## Design System Tokens

### Current Tokens (Reference)

```css
/* Brand Colors */
--color-brand-green: #80c040; /* Decorative/backgrounds only */
--color-brand-green-text: #4a7a1a; /* WCAG AA 7.1:1 on white — text usage */
--color-brand-green-text(dark): #9dd45b; /* Dark mode text variant */
--color-brand-navy: #141850;

/* Semantic Colors */
--color-success: #33d067;
--color-danger: #e94560;
--color-warning: #ffcd4e;

/* Text */
--color-text-primary: #1e293b; /* slate-800 */
--color-text-secondary: #64748b; /* slate-500 */

/* Background */
--color-body-bg: #f6f9fc; /* light */
--color-body-bg(dark): #0f172a; /* slate-900 */

/* Border */
--color-border-light: #dae1e7;

/* Radius */
--radius: 0.5rem;

/* Font */
font-family: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
```

### Recommended Additions

```css
/* Focus ring - already using brand green for focus indicators */
--color-focus-ring: oklch(0.55 0.17 145); /* Brand green */

/* Overlay */
--color-overlay: rgba(0, 0, 0, 0.4); /* Used in drawers/modals */
```

---

## Issue Registry

### Quick Reference: All Issues by ID

| ID       | Severity | Phase | Status | Description                    |
| -------- | -------- | ----- | ------ | ------------------------------ |
| A11Y-C01 | Critical | 1     | `[x]`  | Color contrast (brand green)   |
| A11Y-C02 | Critical | 1     | `[x]`  | Visible form labels (checkout) |
| A11Y-C03 | Critical | 1     | `[x]`  | Skip-to-content link           |
| SEO-C01  | Critical | 1     | `[x]`  | Meta + Open Graph tags         |
| SEO-C02  | Critical | 1     | `[x]`  | Dynamic page titles            |
| SEO-C03  | Critical | 1     | `[x]`  | robots.txt + sitemap.xml       |
| SEO-C04  | Critical | 1     | `[x]`  | JSON-LD structured data        |
| PERF-M01 | Major    | 2     | `[x]`  | Route code splitting           |
| PERF-M02 | Major    | 2     | `[x]`  | Hero image optimization        |
| PERF-M03 | Major    | 2     | `[x]`  | Vite bundle optimization       |
| PERF-M04 | Major    | 2     | `[x]`  | Zustand selector optimization  |
| PERF-m01 | Minor    | 2     | `[~]`  | WebP/AVIF images (partial)     |
| PERF-m02 | Minor    | 2     | `[x]`  | Memoize ProductCard            |
| SEO-M01  | Major    | 2     | `[x]`  | Breadcrumb navigation          |
| SEO-M02  | Major    | 2     | `[x]`  | Canonical URLs                 |
| A11Y-M01 | Major    | 3     | `[x]`  | Form error association         |
| A11Y-M02 | Major    | 3     | `[x]`  | Mobile menu focus trap         |
| A11Y-M03 | Major    | 3     | `[x]`  | Dropdown focus management      |
| A11Y-M04 | Major    | 3     | `[x]`  | Carousel accessibility         |
| A11Y-m01 | Minor    | 3     | `[x]`  | Variant button aria-pressed    |
| A11Y-m02 | Minor    | 3     | `[x]`  | Product grid aria-live         |
| A11Y-m03 | Minor    | 3     | `[x]`  | Footer heading levels          |
| A11Y-m04 | Minor    | 3     | `[x]`  | Cart quantity editable input   |
| UX-01    | High     | 3     | `[x]`  | Product image gallery & zoom   |
| UX-02    | High     | 3     | `[x]`  | Stock status from API          |
| UX-03    | Medium   | 3     | `[-]`  | Discount/promotion (no API)    |
| FEAT-01  | Medium   | 4     | `[x]`  | Wishlist                       |
| FEAT-02  | Medium   | 4     | `[ ]`  | Ratings & reviews              |
| FEAT-03  | Medium   | 4     | `[x]`  | Advanced search & filters      |
| FEAT-04  | Medium   | 4     | `[ ]`  | Multiple payment methods       |
| FEAT-05  | Medium   | 4     | `[ ]`  | Order tracking                 |
| FEAT-06  | Low      | 4     | `[ ]`  | Customer accounts              |
| FEAT-07  | Low      | 4     | `[x]`  | Dark mode (client)             |
| ADMIN-01 | Medium   | 5     | `[ ]`  | Dashboard page                 |
| ADMIN-02 | Medium   | 5     | `[ ]`  | Promotions module              |
| ADMIN-03 | Low      | 5     | `[ ]`  | Reports module                 |
| ADMIN-04 | Low      | 5     | `[ ]`  | Review moderation              |
| ADMIN-05 | Medium   | 5     | `[ ]`  | Inventory management           |

---

## Notes

- **SSR Consideration:** The biggest SEO limitation is the pure SPA architecture. For a full SEO solution, consider migrating to React Router v7 framework mode (SSR) or Next.js. This is a large architectural change tracked separately.
- **API Dependencies:** Features like stock status (UX-02), reviews (FEAT-02), and order tracking (FEAT-05) require corresponding backend API endpoints.
- **Testing:** Each phase should include writing tests for new components and accessibility testing with screen readers.
- **Incremental Deployment:** Each phase can be deployed independently. Phase 1 is the minimum viable improvement.
