import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutSuccess = () => (
	<div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
		<div className="rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30">
			<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
				<CheckCircle size={32} className="text-green-600" />
			</div>
			<h2 className="mb-2 text-xl font-bold">Mua hàng thành công</h2>
			<p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
				Cảm ơn bạn đã đặt hàng tại Nhà Sách Kiên Giang!
			</p>
			<Link
				to="/"
				className="inline-block rounded-md bg-[var(--color-brand-green)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-green)]/90"
			>
				Về trang chủ
			</Link>
		</div>
	</div>
);

export default CheckoutSuccess;
