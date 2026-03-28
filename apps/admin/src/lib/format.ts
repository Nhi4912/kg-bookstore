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
