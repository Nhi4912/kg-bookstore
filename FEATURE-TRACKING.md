# Feature Tracking — KG Bookstore

> So sánh tính năng giữa **Legacy Repo** (`apollo-frontend-client`) và **New Monorepo** (`kgbookstore`).
>
> Cập nhật lần cuối: 2026-03-29

## Legend

| Icon | Meaning                               |
| ---- | ------------------------------------- |
| ✅   | Đã triển khai đầy đủ                  |
| 🔶   | Triển khai một phần                   |
| ❌   | Chưa triển khai                       |
| 🆕   | Tính năng mới (không có trong legacy) |
| ➖   | Không áp dụng                         |

---

## 1. Client App (Storefront)

### 1.1 Pages / Routes

| Feature                          | Legacy | New Client | Notes |
| -------------------------------- | ------ | ---------- | ----- |
| Trang chủ `/`                    | ✅     | ✅         |       |
| Chi tiết sản phẩm `/product/:id` | ✅     | ✅         |       |
| Tìm kiếm `/product/search/:name` | ✅     | ✅         |       |
| Bộ sưu tập `/collection/:id`     | ✅     | ✅         |       |
| SP theo tag `/products/tag/:id`  | ✅     | ✅         |       |
| Giỏ hàng + Checkout `/cart`      | ✅     | ✅         |       |
| Điều khoản dịch vụ               | ✅     | ✅         |       |
| Chính sách bảo mật               | ✅     | ✅         |       |
| Chính sách đổi trả               | ✅     | ✅         |       |
| Phương thức vận chuyển           | ✅     | ✅         |       |
| Hướng dẫn thanh toán             | ✅     | ✅         |       |
| Liên hệ                          | ✅     | ✅         |       |
| Trang 404                        | ✅     | ✅         |       |

**Summary: 13/13 pages — 100% coverage**

---

### 1.2 Layout & Navigation

| Feature                         | Legacy | New Client | Notes                                                        |
| ------------------------------- | ------ | ---------- | ------------------------------------------------------------ |
| Header (logo, search, giỏ hàng) | ✅     | ✅         |                                                              |
| Sticky header                   | ✅     | ✅         |                                                              |
| Desktop navbar (menu dropdown)  | ✅     | ✅         | Legacy: component riêng; New: tích hợp trong navbar          |
| Mobile hamburger menu           | ✅     | ✅         |                                                              |
| Mobile navigation drawer        | ✅     | ✅         |                                                              |
| Footer (4 cột, liên kết, info)  | ✅     | ✅         |                                                              |
| Mobile footer                   | ✅     | ✅         | Legacy: component riêng `MFooter`; New: responsive footer    |
| Scroll to top                   | ❌     | ✅ 🆕      | New: `ScrollToTop` component tự động scroll khi chuyển trang |

---

### 1.3 Trang chủ (Home Page)

| Feature                   | Legacy | New Client | Notes                                                      |
| ------------------------- | ------ | ---------- | ---------------------------------------------------------- |
| Hero banner carousel      | ✅     | ✅         | Legacy: react-multi-carousel; New: CSS animation carousel  |
| Danh mục nổi bật          | ✅     | ✅         | `SectionFeaturedCategory` → `featured-categories`          |
| Sản phẩm theo tag         | ✅     | ✅         | `SpecialCategory` → `products-by-tag`                      |
| Form đăng ký nhận tin     | ✅     | ✅         |                                                            |
| Banner khuyến mãi         | ✅     | 🔶         | Legacy: `Discount` component; New: placeholder banners chỉ |
| Skeleton loading (banner) | ✅     | ❌         | Legacy: `BannerSkeleton`; New: chưa có skeleton cho banner |

---

### 1.4 Sản phẩm (Products)

| Feature                          | Legacy | New Client | Notes                                                    |
| -------------------------------- | ------ | ---------- | -------------------------------------------------------- |
| Product card (ảnh, tên, giá)     | ✅     | ✅         | Legacy: 2 variant (`ProductCard1`, `ProductCard2`)       |
| Product card skeleton loading    | ✅     | ✅         | Legacy: `ProductCardSkeleton`; New: trong `product-grid` |
| Product grid layout              | ✅     | ✅         |                                                          |
| Product detail — hình ảnh        | ✅     | ✅         |                                                          |
| Product detail — thông tin & giá | ✅     | ✅         |                                                          |
| Product detail — chọn biến thể   | ✅     | ✅         |                                                          |
| Product detail — chọn số lượng   | ✅     | ✅         |                                                          |
| Product detail — thêm vào giỏ    | ✅     | ✅         |                                                          |
| Product detail — mô tả (tab)     | ✅     | ✅         |                                                          |
| Sản phẩm liên quan               | ✅     | ✅         |                                                          |
| Sản phẩm đã xem gần đây          | ✅     | ✅         | Legacy: localStorage; New: Zustand + persist             |
| Add to cart animation/feedback   | 🔶     | 🔶         | Cả hai đều cơ bản, không có animation đặc biệt           |

---

### 1.5 Tìm kiếm & Lọc (Search & Filter)

| Feature                        | Legacy | New Client | Notes                                             |
| ------------------------------ | ------ | ---------- | ------------------------------------------------- |
| Search box trong header        | ✅     | ✅         |                                                   |
| Search autocomplete dropdown   | ✅     | ❌         | Legacy: hiển thị kết quả gợi ý; New: chỉ navigate |
| Debounced search               | ✅     | ✅         | Legacy: 200ms; New: custom `useDebounce`          |
| Trang kết quả tìm kiếm         | ✅     | ✅         |                                                   |
| Lọc theo nhà cung cấp (vendor) | ✅     | ✅         |                                                   |
| Lọc theo khoảng giá            | ✅     | ✅         |                                                   |
| Xóa bộ lọc                     | ✅     | ✅         |                                                   |
| Mobile filter drawer           | ✅     | ✅         |                                                   |
| Load more pagination           | ✅     | ✅         |                                                   |

---

### 1.6 Giỏ hàng & Thanh toán (Cart & Checkout)

| Feature                              | Legacy | New Client | Notes                                                |
| ------------------------------------ | ------ | ---------- | ---------------------------------------------------- |
| Mini cart drawer                     | ✅     | ✅         |                                                      |
| Cart badge (số lượng)                | ✅     | ✅         |                                                      |
| Trang giỏ hàng đầy đủ                | ✅     | ✅         |                                                      |
| Cập nhật số lượng                    | ✅     | ✅         |                                                      |
| Xóa sản phẩm                         | ✅     | ✅         |                                                      |
| Form checkout (họ tên, SĐT, địa chỉ) | ✅     | ✅         |                                                      |
| Chọn tỉnh/quận/phường (cascading)    | ❌     | ✅ 🆕      | New: cascading location selectors                    |
| Validation form                      | ✅     | ✅         | Legacy: Joi; New: Zod v4                             |
| Phương thức thanh toán COD           | ✅     | ✅         |                                                      |
| Đặt hàng thành công (success state)  | ✅     | ✅         | Legacy: modal; New: inline success                   |
| Cart persist (localStorage)          | ✅     | ✅         | Legacy: Redux + localStorage; New: Zustand + persist |
| Error toast khi đặt hàng thất bại    | ❌     | ✅ 🆕      | New: onError callback trong `use-create-order`       |
| Escape key đóng drawer               | ❌     | ✅ 🆕      | New: keyboard a11y cho tất cả drawer                 |

---

### 1.7 UI Components

| Feature            | Legacy | New Client | Notes                                              |
| ------------------ | ------ | ---------- | -------------------------------------------------- |
| Carousel/Slider    | ✅     | ✅         | Legacy: react-multi-carousel; New: CSS-based       |
| Modal/Dialog       | ✅     | 🔶         | Legacy: DynamicModal + queue system; New: cơ bản   |
| Drawer/Sidenav     | ✅     | ✅         |                                                    |
| Accordion          | ✅     | ❌         | Legacy: custom Accordion component                 |
| Skeleton loading   | ✅     | ✅         |                                                    |
| Custom icons (90+) | ✅     | ❌         | Legacy: 90+ custom SVG icons; New: dùng emoji/text |
| Sticky wrapper     | ✅     | ✅         | Tích hợp trong header                              |
| FlexBox helper     | ✅     | ❌         | New: dùng Tailwind flex classes thay thế           |
| Typography helpers | ✅     | ❌         | New: dùng Tailwind typography thay thế             |
| Toast/Snackbar     | ❌     | ❌         | Cả hai đều thiếu toast notification system         |

---

### 1.8 Accessibility (A11Y)

| Feature                            | Legacy | New Client | Notes                                |
| ---------------------------------- | ------ | ---------- | ------------------------------------ |
| aria-label trên buttons            | ❌     | ✅ 🆕      | New: audit đã thêm đầy đủ            |
| aria-label trên form inputs        | ❌     | ✅ 🆕      | New: search, subscription, cart form |
| aria-haspopup/expanded trên navbar | ❌     | ✅ 🆕      |                                      |
| role=dialog trên drawer            | ❌     | ✅ 🆕      |                                      |
| Keyboard navigation (Escape key)   | ❌     | ✅ 🆕      |                                      |
| Touch targets (min 44px)           | ❌     | ✅ 🆕      |                                      |
| Responsive drawer width            | ❌     | ✅ 🆕      | `min(280px, 85vw)`                   |

---

### 1.9 Technical Infrastructure

| Feature          | Legacy         | New Client        | Notes                                   |
| ---------------- | -------------- | ----------------- | --------------------------------------- |
| State management | Redux Toolkit  | Zustand           |                                         |
| Data fetching    | React Query 4  | React Query 5     |                                         |
| Form validation  | Joi + RHF      | Zod v4            |                                         |
| UI framework     | Material UI 5  | Tailwind + shadcn | New: nhẹ hơn, tùy biến tốt hơn          |
| HTTP client      | Axios          | Axios             |                                         |
| Routing          | React Router 6 | React Router      |                                         |
| Mock data system | ❌             | ✅ 🆕             | 9 files, 36 products, interceptor-based |
| Build size       | Không rõ       | 450KB JS          |                                         |

---

## 2. Admin App

> Admin app là tính năng **hoàn toàn mới** — legacy repo không có admin panel.

| Feature                    | Legacy | New Admin | Notes                           |
| -------------------------- | ------ | --------- | ------------------------------- |
| Đăng nhập / Đăng ký        | ➖     | ✅ 🆕     | Auth guards + cookie-based      |
| Dashboard (Tổng quan)      | ➖     | 🔶        | Route có, hiện "Coming soon"    |
| **Sản phẩm**               |        |           |                                 |
| ├ Danh sách sản phẩm       | ➖     | ✅ 🆕     | DataTable + filter + pagination |
| ├ Tạo sản phẩm             | ➖     | ✅ 🆕     |                                 |
| ├ Sửa sản phẩm             | ➖     | ✅ 🆕     |                                 |
| ├ Quản lý biến thể         | ➖     | ✅ 🆕     | Tạo/sửa variant                 |
| **Bộ sưu tập**             |        |           |                                 |
| ├ Danh sách bộ sưu tập     | ➖     | ✅ 🆕     |                                 |
| ├ Tạo bộ sưu tập           | ➖     | ✅ 🆕     |                                 |
| ├ Sửa bộ sưu tập           | ➖     | ✅ 🆕     |                                 |
| **Đơn hàng**               |        |           |                                 |
| ├ Danh sách đơn hàng       | ➖     | ✅ 🆕     |                                 |
| ├ Chi tiết đơn hàng        | ➖     | ✅ 🆕     |                                 |
| ├ Tạo đơn hàng             | ➖     | ✅ 🆕     | Cascading location select       |
| **Menu**                   |        |           |                                 |
| ├ Quản lý menu (drag-drop) | ➖     | ✅ 🆕     | Tree editor + collection dialog |
| **Khuyến mãi**             | ➖     | 🔶        | Route có, hiện "Coming soon"    |
| **Báo cáo**                | ➖     | 🔶        | Route có, hiện "Coming soon"    |

---

## 3. Shared Packages

| Package                  | Legacy | New Monorepo | Notes                                    |
| ------------------------ | ------ | ------------ | ---------------------------------------- |
| `api-contract`           | ❌     | ✅ 🆕        | OpenAPI + Zod schemas cho tất cả domains |
| `ui` (shared components) | ❌     | ✅ 🆕        | shadcn/ui base-nova shared components    |

---

## 4. Tổng kết Gap Analysis

### Features từ Legacy chưa được triển khai trong New Client

| #   | Feature                      | Priority | Effort | Notes                                      |
| --- | ---------------------------- | -------- | ------ | ------------------------------------------ |
| 1   | Search autocomplete dropdown | Medium   | Small  | Hiển thị kết quả gợi ý khi gõ search       |
| 2   | Banner khuyến mãi thực tế    | Low      | Small  | Thay thế placeholder banners bằng ảnh thật |
| 3   | Banner skeleton loading      | Low      | Small  | Skeleton cho hero carousel khi loading     |
| 4   | Accordion component          | Low      | Small  | Có thể cần cho FAQ hoặc product info       |
| 5   | Custom SVG icon library      | Low      | Medium | Legacy có 90+ icons; New dùng text/emoji   |
| 6   | Modal queue system           | Low      | Medium | Legacy quản lý nhiều modal tuần tự         |
| 7   | Toast/Snackbar notification  | Medium   | Small  | Cả hai đều thiếu — nên thêm cho UX tốt hơn |

### Features MỚI trong New (không có trong Legacy)

| #   | Feature                           | App    | Notes                                     |
| --- | --------------------------------- | ------ | ----------------------------------------- |
| 1   | Admin panel đầy đủ                | Admin  | CRUD products, collections, orders, menus |
| 2   | Auth system (login/signup)        | Admin  | Cookie-based + guards                     |
| 3   | Mock data system                  | Client | 9 files, dev without backend              |
| 4   | Cascading location select         | Both   | Tỉnh → Quận → Phường trong checkout       |
| 5   | Accessibility audit (A11Y)        | Client | aria-labels, keyboard nav, touch targets  |
| 6   | Scroll to top                     | Client | Auto scroll khi chuyển trang              |
| 7   | Error handling (order fail toast) | Client | onError callback                          |
| 8   | API contract package              | Shared | OpenAPI + Zod schemas                     |
| 9   | Monorepo architecture             | All    | Turborepo + pnpm workspaces               |
| 10  | Zod v4 validation                 | Both   | Thay thế Joi                              |
| 11  | Tailwind + shadcn UI              | Both   | Nhẹ hơn MUI, tùy biến tốt hơn             |

---

## 5. Roadmap — Chưa triển khai (cả Legacy lẫn New)

Những tính năng mà **cả legacy lẫn new đều chưa có** nhưng nên cân nhắc:

| #   | Feature                   | Priority | Notes                               |
| --- | ------------------------- | -------- | ----------------------------------- |
| 1   | Đăng nhập khách hàng      | High     | Customer accounts                   |
| 2   | Lịch sử đơn hàng          | High     | Xem đơn đã đặt                      |
| 3   | Wishlist / Yêu thích      | Medium   | Lưu sản phẩm yêu thích              |
| 4   | Đánh giá / Nhận xét       | Medium   | Product reviews & ratings           |
| 5   | Thanh toán online         | High     | VNPay, MoMo, ZaloPay...             |
| 6   | SEO meta tags             | Medium   | react-helmet hoặc tương đương       |
| 7   | Blog / Tin tức            | Low      | Content marketing                   |
| 8   | Mã giảm giá (coupon)      | Medium   | Promo codes at checkout             |
| 9   | Push notifications        | Low      | Thông báo cho khách hàng            |
| 10  | Chia sẻ mạng xã hội       | Low      | Share product lên Facebook, Zalo... |
| 11  | Admin Dashboard analytics | Medium   | Thống kê doanh thu, đơn hàng        |
| 12  | Admin Promotions module   | Medium   | Quản lý khuyến mãi                  |
| 13  | Admin Reports module      | Medium   | Báo cáo chi tiết                    |

---

_Cập nhật file này khi có tính năng mới được triển khai hoặc phát hiện thêm gap._
