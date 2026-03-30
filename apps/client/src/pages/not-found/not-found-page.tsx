import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/use-document-title";

const NotFoundPage = () => {
	useDocumentTitle("Không tìm thấy trang");

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
			<h1 className="mb-2 text-7xl font-bold text-gray-300">404</h1>
			<p className="mb-6 text-gray-500">Trang bạn tìm kiếm không tồn tại.</p>
			<Link
				to="/"
				className="rounded-md bg-[var(--color-brand-green)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-green)]/90"
			>
				Về trang chủ
			</Link>
		</div>
	);
};

export default NotFoundPage;
