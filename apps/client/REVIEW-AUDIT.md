# Client App — Review Audit Specs

> **Created**: 2026-03-29
> **Scope**: `apps/client/src/` — UI/UX, accessibility, coding standards
> **Status**: In Progress

---

## Summary

| Category         | Critical | High   | Medium | Total  |
| ---------------- | -------- | ------ | ------ | ------ |
| Accessibility    | 4        | 8      | 2      | 14     |
| UX               | 0        | 4      | 0      | 4      |
| Responsive/Touch | 0        | 0      | 4      | 4      |
| Coding Standards | 0        | 0      | 1      | 1      |
| **Total**        | **4**    | **12** | **7**  | **23** |

---

## Coding Standards (fe-codegen)

All rules pass **except one**:

- [x] CS-1 `mocks/setup.ts:38` — `let items = [...]` uses `let` instead of `const` with functional chaining — **Rule 2 (const only)** — Medium

**Passing rules**: No `function` keyword (Rule 1), all `export default` (Rule 3), no `any` (Rule 4), Zod from `"zod/v4"` (Rule 5).

---

## Batch 1 — Critical + High (a11y + UX)

### Critical Accessibility (P0)

- [x] A11Y-1 `search-box.tsx:24` — Input missing label → Add `aria-label="Tìm kiếm sản phẩm"`
- [x] A11Y-2 `subscription-form.tsx:28` — Email input missing label → Add `aria-label="Email"`
- [x] A11Y-3 `cart-page.tsx:208-248` — 4 checkout form inputs missing labels → Add `aria-label` for each
- [x] A11Y-4 `product-detail-page.tsx:202,212` — Qty +/- buttons missing aria-labels → Add `aria-label="Giảm số lượng"` / `"Tăng số lượng"`

### High Accessibility (P1)

- [x] A11Y-5 `navbar.tsx:11-17` — Dropdown menus missing `aria-expanded`, `aria-haspopup` → Add attributes to parent link
- [x] A11Y-6 `mini-cart.tsx:26` — Drawer missing `role="dialog"`, `aria-modal="true"` → Add to drawer div
- [x] A11Y-7 `mini-cart.tsx:33` — Close button missing `aria-label` → Add `aria-label="Đóng giỏ hàng"`
- [x] A11Y-8 `mini-cart.tsx:62,69` — Qty +/- buttons missing `aria-label` → Add `"Giảm"` / `"Tăng"`
- [x] A11Y-9 `mini-cart.tsx:78` — Remove button missing `aria-label` → Add `aria-label="Xoá khỏi giỏ"`
- [x] A11Y-10 `product-card.tsx:54` — Add-to-cart button missing product-specific aria → Add `aria-label`
- [x] A11Y-11 `product-detail-page.tsx:235` — Add-to-cart button → Add `aria-label`
- [x] A11Y-12 `collection-page.tsx:115`, `product-search-page.tsx:104`, `products-by-tag-page.tsx:119` — Mobile filter close button missing `aria-label` → Add `aria-label="Đóng bộ lọc"`

### High UX (P1)

- [x] UX-1 `cart-page.tsx:107` — No error handling when order creation fails → Add `onError`, show `toast.error()`
- [x] UX-2 `cart-page.tsx:77-92` — Cart qty +/- buttons missing `aria-label` → Add labels
- [x] UX-3 `mini-cart.tsx`, `collection-page.tsx`, `product-search-page.tsx`, `products-by-tag-page.tsx` — Drawers don't close on Escape key → Add `useEffect` keydown handler
- [x] UX-4 `product-detail-page.tsx:198` — Stock status uses hardcoded `text-green-600` → Align to `var(--color-brand-green)`

---

## Batch 2 — Responsive / Touch Targets (Medium)

- [x] R-1 `product-detail-page.tsx:178` — Fixed `w-[300px]` image placeholder → Change to `max-w-[300px] w-full`
- [x] R-2 `collection-page.tsx:112`, `product-search-page.tsx:101`, `products-by-tag-page.tsx:115` — Mobile drawer `w-[280px]` → Use `w-[min(280px,85vw)]`
- [x] R-3 `mini-cart.tsx:62-73` — Qty buttons `p-0.5` too small → Increase to `p-1.5`
- [x] R-4 `product-detail-page.tsx:202-215` — Qty buttons `p-2` borderline → Increase to `p-2.5`

---

## Verification

- [x] `pnpm run typecheck` — 0 errors
- [x] `pnpm run build` — succeeds (450KB JS / 136KB gzip, 30KB CSS)
- [ ] Commit + push
