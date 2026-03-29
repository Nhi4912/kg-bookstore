import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

/**
 * Format a number as Vietnamese Dong (VND).
 * Example: 150000 → "150.000 ₫"
 */
export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(value);
};

/**
 * Format a date string for display.
 * Example: "2024-01-15T10:30:00Z" → "15/01/2024 10:30"
 */
export const formatDate = (
	date: string | Date,
	format = "DD/MM/YYYY HH:mm",
): string => {
	return dayjs(date).format(format);
};

/**
 * Format a date string as relative time.
 * Example: "2 giờ trước"
 */
export const formatRelativeDate = (date: string | Date): string => {
	return dayjs(date).fromNow();
};

/**
 * Format customer full name.
 * Example: { last_name: "Nguyễn", first_name: "Văn A" } → "Nguyễn Văn A"
 */
export const formatCustomerName = (
	customer?: { last_name?: string; first_name?: string } | null,
): string => {
	if (!customer) return "—";
	return (
		`${customer.last_name ?? ""} ${customer.first_name ?? ""}`.trim() || "—"
	);
};

/**
 * Format shipping address from shipment fields.
 */
export const formatAddress = (
	shipment?: {
		address?: string;
		ward_name?: string;
		district_name?: string;
		province_name?: string;
	} | null,
): string => {
	if (!shipment) return "—";
	return (
		[
			shipment.address,
			shipment.ward_name,
			shipment.district_name,
			shipment.province_name,
		]
			.filter(Boolean)
			.join(", ") || "—"
	);
};

/**
 * Calculate total amount from bill items.
 */
export const calculateBillTotal = (
	billItems: Array<{ final_price: number }>,
): number => billItems.reduce((sum, item) => sum + item.final_price, 0);
