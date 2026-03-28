export const STOCK_STATUS_OPTIONS = [
	{ value: "", label: "Tất cả" },
	{ value: "IN_STOCK", label: "Còn hàng" },
	{ value: "OUT_OF_STOCK", label: "Hết hàng" },
] as const;

export const VISIBILITY_OPTIONS = [
	{ value: "", label: "Tất cả" },
	{ value: "true", label: "Hiển thị" },
	{ value: "false", label: "Ẩn" },
] as const;

export const PRICE_SORT_OPTIONS = [
	{ value: "", label: "Mặc định" },
	{ value: "asc", label: "Giá tăng dần" },
	{ value: "desc", label: "Giá giảm dần" },
] as const;
