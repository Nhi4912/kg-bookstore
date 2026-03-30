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

| Area          | Score | Key Problem                                  |
| ------------- | ----- | -------------------------------------------- |
| Accessibility | 5/10  | Color contrast fails WCAG, no visible labels |
| SEO           | 2/10  | No meta tags, no structured data, pure SPA   |
| Performance   | 6/10  | No code splitting, no image optimization     |
| E-commerce UX | 4/10  | Missing wishlist, reviews, breadcrumbs       |
| Admin Panel   | 7/10  | Good foundation, needs dashboard + reports   |

---

## Phase 1: Critical Fixes

> **Priority:** Blocking / Must-fix before launch
> **Timeline:** Week 1-2
> **App:** Client

### 1.1 Accessibility - Critical

#### A11Y-C01: Fix Color Contrast (Brand Green)

- **Status:** `[ ]` Pending
- **Severity:** Critical | WCAG 1.4.3
- **File:** `apps/client/src/index.css:45`
- **Problem:** Brand green `#80c040` has ~2.9:1 contrast ratio on white. WCAG AA requires 4.5:1 for normal text.
- **Fix:** Replace with darker green variant for text usage. Suggested: `#4a7a1a` (7.1:1) for text, keep `#80c040` for decorative/non-text only.
- **Scope:**
  - [ ] Update `--color-brand-green` or add `--color-brand-green-text` variable
  - [ ] Audit all text using brand green (buttons, links, prices, badges)
  - [ ] Ensure buttons have sufficient contrast (3:1 for UI components)
  - [ ] Test with contrast checker tool

#### A11Y-C02: Add Visible Form Labels (Checkout)

- **Status:** `[ ]` Pending
- **Severity:** Critical | WCAG 1.3.1, 3.3.2
- **File:** `apps/client/src/pages/cart/checkout-form.tsx:82-146`
- **Problem:** All form inputs use only `aria-label` with placeholder text. Placeholders disappear on focus and are not accessible labels.
- **Fix:**
  - [ ] Add visible `<label>` elements above each input
  - [ ] Keep `aria-label` as backup but `<label htmlFor>` is primary
  - [ ] Style labels consistently (text-sm, font-medium, text-text-primary)

#### A11Y-C03: Add Skip-to-Content Link

- **Status:** `[ ]` Pending
- **Severity:** Critical | WCAG 2.4.1
- **File:** `apps/client/src/components/layout/root-layout.tsx:6-15`
- **Fix:**
  - [ ] Add visually hidden skip link as first focusable element
  - [ ] Add `id="main-content"` to main content area
  - [ ] Link becomes visible on focus (`:focus-visible`)

### 1.2 SEO - Critical

#### SEO-C01: Add Meta Description + Open Graph

- **Status:** `[ ]` Pending
- **Severity:** Critical
- **File:** `apps/client/index.html:1-13`
- **Fix:**
  - [ ] Add `<meta name="description" content="Nhà Sách Kiên Giang - ...">` to index.html
  - [ ] Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
  - [ ] Add Twitter Card tags (`twitter:card`, `twitter:title`, etc.)
  - [ ] Add `<link rel="canonical">` base

#### SEO-C02: Dynamic Page Titles

- **Status:** `[ ]` Pending
- **Severity:** Critical
- **File:** `apps/client/src/App.tsx`, all page components
- **Problem:** All pages show static "Nhà Sách Kiên Giang" title.
- **Fix:**
  - [ ] Install `react-helmet-async` or use React Router `<title>` (v7 supports it)
  - [ ] Add unique titles per page: Home, Product Detail (product name), Collection, Cart, etc.
  - [ ] Pattern: `"{Page} | Nhà Sách Kiên Giang"`

#### SEO-C03: Add robots.txt and sitemap.xml

- **Status:** `[ ]` Pending
- **Severity:** Critical
- **Files:** `apps/client/public/robots.txt`, `apps/client/public/sitemap.xml`
- **Fix:**
  - [ ] Create `robots.txt` with sitemap reference
  - [ ] Create basic `sitemap.xml` (or generate dynamically)
  - [ ] Add `<link rel="sitemap">` to index.html

#### SEO-C04: JSON-LD Structured Data

- **Status:** `[ ]` Pending
- **Severity:** Critical
- **Files:** Product detail page, Home page, all pages (Organization)
- **Fix:**
  - [ ] Add `Organization` schema to root layout
  - [ ] Add `Product` schema to product detail page
  - [ ] Add `BreadcrumbList` schema (after breadcrumbs are implemented)
  - [ ] Add `WebSite` schema with search action

---

## Phase 2: SEO & Performance

> **Priority:** High - Impacts discoverability and Core Web Vitals
> **Timeline:** Week 3-4
> **App:** Client

### 2.1 Performance - Major

#### PERF-M01: Route-Based Code Splitting

- **Status:** `[ ]` Pending
- **Severity:** Major
- **File:** `apps/client/src/App.tsx:28-51`
- **Problem:** All routes loaded as single bundle.
- **Fix:**
  - [ ] Convert all page imports to `React.lazy()`
  - [ ] Wrap routes in `<Suspense fallback={<PageSkeleton />}>`
  - [ ] Measure bundle size before/after

#### PERF-M02: Hero Image Optimization

- **Status:** `[ ]` Pending
- **Severity:** Major
- **File:** `apps/client/src/pages/home/hero-section.tsx:29-50`
- **Problem:** Preloads ALL carousel images on initial load.
- **Fix:**
  - [ ] Only preload first slide image
  - [ ] Lazy-load remaining slides on demand
  - [ ] Add `fetchpriority="high"` to first image (LCP element)
  - [ ] Convert to WebP/AVIF format with `<picture>` fallback

#### PERF-M03: Vite Bundle Optimization

- **Status:** `[ ]` Pending
- **Severity:** Major
- **File:** `apps/client/vite.config.ts`
- **Fix:**
  - [ ] Add `build.rollupOptions.output.manualChunks` for vendor splitting
  - [ ] Separate: react, react-dom | router | query | ui-libs
  - [ ] Enable `build.cssCodeSplit: true`
  - [ ] Analyze with `rollup-plugin-visualizer`

#### PERF-M04: Zustand Selector Optimization

- **Status:** `[ ]` Pending
- **Severity:** Major
- **Files:** `apps/client/src/components/layout/header.tsx:10-12`, `apps/client/src/pages/cart/cart-page.tsx:9-11`
- **Problem:** `useCartStore(s => s.totalItems())` creates new function each render.
- **Fix:**
  - [ ] Move `totalItems` to a derived selector: `const totalItems = useCartStore(s => s.items.length)`
  - [ ] Or use `useShallow` from zustand for multi-value selections
  - [ ] Audit all Zustand usage for similar patterns

### 2.2 Performance - Minor

#### PERF-m01: Image Format Optimization

- **Status:** `[ ]` Pending
- **Severity:** Minor
- **Fix:**
  - [ ] Convert all static images to WebP (with JPEG fallback)
  - [ ] Add responsive `srcset` for product images
  - [ ] Use `loading="lazy"` for below-fold images

#### PERF-m02: Memoize ProductCard

- **Status:** `[ ]` Pending
- **Severity:** Minor
- **File:** `apps/client/src/components/shared/product-card.tsx`
- **Fix:**
  - [ ] Wrap component in `React.memo()`
  - [ ] Ensure callbacks use `useCallback` in parent

### 2.3 SEO - Major

#### SEO-M01: Breadcrumb Navigation

- **Status:** `[ ]` Pending
- **Severity:** Major
- **Files:** New component + all page layouts
- **Fix:**
  - [ ] Create `<Breadcrumb>` shared component
  - [ ] Add to: Product Detail, Collection, Search, Tag pages
  - [ ] Include `BreadcrumbList` JSON-LD schema
  - [ ] Vietnamese labels: "Trang chủ > Danh mục > Sản phẩm"

#### SEO-M02: Canonical URLs

- **Status:** `[ ]` Pending
- **Severity:** Major
- **Fix:**
  - [ ] Add `<link rel="canonical">` to each page via react-helmet-async
  - [ ] Handle query parameter normalization (remove tracking params)

---

## Phase 3: UX Improvements

> **Priority:** Medium - Improves user experience significantly
> **Timeline:** Week 5-6
> **App:** Client

### 3.1 Accessibility - Major

#### A11Y-M01: Form Error Association

- **Status:** `[ ]` Pending
- **Severity:** Major | WCAG 1.3.1
- **File:** `apps/client/src/pages/cart/checkout-form.tsx:88-134`
- **Fix:**
  - [ ] Add `id="[field]-error"` to error messages
  - [ ] Add `aria-describedby="[field]-error"` to corresponding inputs
  - [ ] Add `aria-invalid={true}` when field has error
  - [ ] Wrap errors in `role="alert"` for live announcements

#### A11Y-M02: Mobile Menu Focus Trap

- **Status:** `[ ]` Pending
- **Severity:** Major | WCAG 2.4.3
- **File:** `apps/client/src/components/layout/header.tsx:19-25`
- **Fix:**
  - [ ] Implement focus trap when mobile menu opens
  - [ ] Return focus to hamburger button when menu closes
  - [ ] Close on Escape key
  - [ ] Prevent background scroll

#### A11Y-M03: Dropdown Navigation Focus Management

- **Status:** `[ ]` Pending
- **Severity:** Major | WCAG 2.4.3
- **File:** `apps/client/src/components/layout/navbar.tsx:61-81`
- **Fix:**
  - [ ] Arrow key navigation within dropdown
  - [ ] Escape to close dropdown and return focus
  - [ ] Tab should close dropdown and move to next element

#### A11Y-M04: Carousel Accessibility

- **Status:** `[ ]` Pending
- **Severity:** Major | WCAG 4.1.2
- **File:** `apps/client/src/pages/home/hero-section.tsx:103-114`
- **Fix:**
  - [ ] Add `role="tablist"` to dot container
  - [ ] Add `role="tab"` + `aria-selected` to each dot
  - [ ] Add `role="tabpanel"` to slide container
  - [ ] Add play/pause button for auto-advance
  - [ ] Respect `prefers-reduced-motion`

### 3.2 Accessibility - Minor

#### A11Y-m01: Variant Button aria-pressed

- **Status:** `[ ]` Pending
- **File:** `apps/client/src/pages/product-detail/variant-button.tsx:17-27`
- **Fix:** Add `aria-pressed={isSelected}` to variant buttons

#### A11Y-m02: Product Grid aria-live

- **Status:** `[ ]` Pending
- **File:** `apps/client/src/components/shared/product-grid.tsx:63-67`
- **Fix:** Add `aria-live="polite"` to grid container + announce item count changes

#### A11Y-m03: Footer Heading Levels

- **Status:** `[ ]` Pending
- **File:** `apps/client/src/components/layout/footer.tsx:32,50,67,84`
- **Fix:** Change `<h4>` to `<h2>` with appropriate visual styling

#### A11Y-m04: Cart Quantity as Editable Input

- **Status:** `[ ]` Pending
- **Files:** `cart-item-card.tsx:66`, `mini-cart.tsx:88`
- **Fix:** Replace `<span>` with `<input type="number" min="1">` for direct quantity editing

### 3.3 UX Enhancements

#### UX-01: Product Image Gallery & Zoom

- **Status:** `[ ]` Pending
- **Severity:** High
- **File:** `apps/client/src/pages/product-detail/product-detail-page.tsx`
- **Fix:**
  - [ ] Add thumbnail gallery below main image
  - [ ] Implement image zoom on hover (or lightbox on click)
  - [ ] Support multiple product images from API

#### UX-02: Stock Status from API

- **Status:** `[ ]` Pending
- **Severity:** High
- **File:** `apps/client/src/pages/product-detail/product-detail-page.tsx:121-122`
- **Problem:** Hardcoded "Còn hàng" (In Stock) regardless of actual status.
- **Fix:**
  - [ ] Read stock status from product variant data
  - [ ] Display "Hết hàng" when out of stock
  - [ ] Disable add-to-cart button when out of stock
  - [ ] Show stock count if < 5 remaining

#### UX-03: Discount/Promotion Display

- **Status:** `[ ]` Pending
- **Severity:** Medium
- **File:** `apps/client/src/pages/product-detail/product-detail-page.tsx:173-178`
- **Problem:** Empty promotion placeholder panel.
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

- **Status:** `[ ]` Pending
- **Scope:**
  - [ ] Heart icon on ProductCard (toggle)
  - [ ] Wishlist page (`/wishlist`)
  - [ ] Persist via localStorage (or API if auth exists)
  - [ ] "Move to cart" action from wishlist
  - [ ] Badge count in header

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

- **Status:** `[ ]` Pending
- **Scope:**
  - [ ] Filter sidebar on collection/search pages
  - [ ] Filter by: price range, author, publisher, category
  - [ ] Sort by: price, name, newest, popularity
  - [ ] URL query parameter sync for shareable filtered views
  - [ ] Mobile: collapsible filter sheet

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

- **Status:** `[ ]` Pending
- **Note:** Admin already has dark mode support.
- **Scope:**
  - [ ] Add dark mode CSS variables to client `index.css`
  - [ ] Theme toggle in header
  - [ ] Respect `prefers-color-scheme` system preference
  - [ ] Persist choice in localStorage

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
--color-brand-green: #80c040; /* Decorative only - fails contrast */
--color-brand-green-text: #4a7a1a; /* TODO: Add for text usage */
--color-brand-navy: #141850;

/* Semantic Colors */
--color-success: #33d067;
--color-danger: #e94560;
--color-warning: #ffcd4e;

/* Text */
--color-text-primary: #2b3445;
--color-text-secondary: #7d879c;

/* Background */
--color-body-bg: #f6f9fc;

/* Radius */
--radius: 0.5rem;

/* Font */
font-family: "Geist Variable", "Open Sans", sans-serif;
```

### Recommended Additions

```css
/* Accessible text variant of brand green */
--color-brand-green-text: #4a7a1a; /* 7.1:1 on white */
--color-brand-green-hover: #6aa030; /* Darker hover state */

/* Focus ring */
--color-focus-ring: #141850; /* Navy for focus indicators */

/* Overlay */
--color-overlay: rgba(0, 0, 0, 0.5);
```

---

## Issue Registry

### Quick Reference: All Issues by ID

| ID       | Severity | Phase | Status | Description                    |
| -------- | -------- | ----- | ------ | ------------------------------ |
| A11Y-C01 | Critical | 1     | `[ ]`  | Color contrast (brand green)   |
| A11Y-C02 | Critical | 1     | `[ ]`  | Visible form labels (checkout) |
| A11Y-C03 | Critical | 1     | `[ ]`  | Skip-to-content link           |
| SEO-C01  | Critical | 1     | `[ ]`  | Meta + Open Graph tags         |
| SEO-C02  | Critical | 1     | `[ ]`  | Dynamic page titles            |
| SEO-C03  | Critical | 1     | `[ ]`  | robots.txt + sitemap.xml       |
| SEO-C04  | Critical | 1     | `[ ]`  | JSON-LD structured data        |
| PERF-M01 | Major    | 2     | `[ ]`  | Route code splitting           |
| PERF-M02 | Major    | 2     | `[ ]`  | Hero image optimization        |
| PERF-M03 | Major    | 2     | `[ ]`  | Vite bundle optimization       |
| PERF-M04 | Major    | 2     | `[ ]`  | Zustand selector optimization  |
| PERF-m01 | Minor    | 2     | `[ ]`  | WebP/AVIF images               |
| PERF-m02 | Minor    | 2     | `[ ]`  | Memoize ProductCard            |
| SEO-M01  | Major    | 2     | `[ ]`  | Breadcrumb navigation          |
| SEO-M02  | Major    | 2     | `[ ]`  | Canonical URLs                 |
| A11Y-M01 | Major    | 3     | `[ ]`  | Form error association         |
| A11Y-M02 | Major    | 3     | `[ ]`  | Mobile menu focus trap         |
| A11Y-M03 | Major    | 3     | `[ ]`  | Dropdown focus management      |
| A11Y-M04 | Major    | 3     | `[ ]`  | Carousel accessibility         |
| A11Y-m01 | Minor    | 3     | `[ ]`  | Variant button aria-pressed    |
| A11Y-m02 | Minor    | 3     | `[ ]`  | Product grid aria-live         |
| A11Y-m03 | Minor    | 3     | `[ ]`  | Footer heading levels          |
| A11Y-m04 | Minor    | 3     | `[ ]`  | Cart quantity editable input   |
| UX-01    | High     | 3     | `[ ]`  | Product image gallery & zoom   |
| UX-02    | High     | 3     | `[ ]`  | Stock status from API          |
| UX-03    | Medium   | 3     | `[ ]`  | Discount/promotion display     |
| FEAT-01  | Medium   | 4     | `[ ]`  | Wishlist                       |
| FEAT-02  | Medium   | 4     | `[ ]`  | Ratings & reviews              |
| FEAT-03  | Medium   | 4     | `[ ]`  | Advanced search & filters      |
| FEAT-04  | Medium   | 4     | `[ ]`  | Multiple payment methods       |
| FEAT-05  | Medium   | 4     | `[ ]`  | Order tracking                 |
| FEAT-06  | Low      | 4     | `[ ]`  | Customer accounts              |
| FEAT-07  | Low      | 4     | `[ ]`  | Dark mode (client)             |
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
