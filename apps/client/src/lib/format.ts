import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

export const formatCurrency = (amount: number): string =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);

export const formatDate = (date: string): string =>
	dayjs(date).format("DD/MM/YYYY");
