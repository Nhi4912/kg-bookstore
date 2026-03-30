import { useState } from "react";
import { toast } from "sonner";

const SubscriptionForm = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;
		setLoading(true);
		await new Promise((r) => setTimeout(r, 500));
		toast.success("Đăng ký nhận bản tin thành công!");
		setEmail("");
		setLoading(false);
	};

	return (
		<div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
			<h3 className="mb-2 text-center text-2xl font-bold">
				Đăng ký nhận bản tin
			</h3>
			<p className="mb-6 text-center text-gray-500 dark:text-gray-400">
				Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông
				tin giảm giá khác.
			</p>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					aria-label="Email"
					required
					className="flex-1 rounded-md border px-4 py-3 text-sm outline-none focus:border-[var(--color-brand-green)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
				/>
				<button
					type="submit"
					disabled={loading}
					className="rounded-md border border-[var(--color-brand-green)] px-6 py-3 text-sm font-semibold text-[var(--color-brand-green-text)] transition-colors hover:bg-[var(--color-brand-green)] hover:text-white disabled:opacity-50"
				>
					ĐĂNG KÝ
				</button>
			</form>
		</div>
	);
};

export default SubscriptionForm;
