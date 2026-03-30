import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

/**
 * Accessible breadcrumb navigation with Schema.org-friendly markup.
 * Last item is rendered as plain text (current page).
 */
const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
	if (items.length === 0) return null;

	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
				{/* Home crumb */}
				<li className="flex items-center">
					<Link
						to="/"
						className="flex items-center gap-1 transition-colors hover:text-[var(--color-brand-green-text)]"
					>
						<Home size={14} aria-hidden="true" />
						<span>Trang chủ</span>
					</Link>
				</li>

				{items.map((item, idx) => {
					const isLast = idx === items.length - 1;
					return (
						<li key={idx} className="flex items-center">
							<ChevronRight
								size={14}
								className="mx-1 text-gray-300"
								aria-hidden="true"
							/>
							{isLast || !item.href ? (
								<span className="font-medium text-gray-800" aria-current="page">
									{item.label}
								</span>
							) : (
								<Link
									to={item.href}
									className="transition-colors hover:text-[var(--color-brand-green-text)]"
								>
									{item.label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumb;
