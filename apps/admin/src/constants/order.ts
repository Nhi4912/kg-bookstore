export const ORDER_STATUS_OPTIONS = [
	{ value: "", label: "Tất cả" },
	{ value: "PENDING", label: "Chờ xử lý" },
	{ value: "SUBMITTED", label: "Đã xác nhận" },
	{ value: "CANCELLED", label: "Đã hủy" },
	{ value: "INVOICED", label: "Đã xuất hóa đơn" },
] as const;

export const SHIPMENT_STATUS_OPTIONS = [
	{ value: "", label: "Tất cả" },
	{ value: "NONE", label: "Không giao" },
	{ value: "PENDING", label: "Chờ giao" },
	{ value: "PACKED", label: "Đã đóng gói" },
	{ value: "DELIVERING", label: "Đang giao" },
	{ value: "DELIVERED", label: "Đã giao" },
	{ value: "RETURNED", label: "Đã trả lại" },
] as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
	CASH: "Tiền mặt",
	CREDIT_AND_DEBIT: "Thẻ tín dụng/ghi nợ",
	MOBILE_WALLET: "Ví điện tử",
	BANK_TRANSFER: "Chuyển khoản",
	CASH_ON_DELIVERY: "COD",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
	PENDING: "Chờ xử lý",
	SUBMITTED: "Đã xác nhận",
	CANCELLED: "Đã hủy",
	INVOICED: "Đã xuất hóa đơn",
} as const;

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
	NONE: "Không giao",
	PENDING: "Chờ giao",
	PACKED: "Đã đóng gói",
	DELIVERING: "Đang giao",
	DELIVERED: "Đã giao",
	RETURNED: "Đã trả lại",
} as const;

export const ORDER_STATUS_VARIANT: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	PENDING: "secondary",
	SUBMITTED: "default",
	CANCELLED: "destructive",
	INVOICED: "outline",
} as const;

export const SHIPMENT_STATUS_VARIANT: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	NONE: "outline",
	PENDING: "secondary",
	PACKED: "secondary",
	DELIVERING: "default",
	DELIVERED: "default",
	RETURNED: "destructive",
} as const;
