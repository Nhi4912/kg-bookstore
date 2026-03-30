import { useDocumentTitle } from "@/hooks/use-document-title";

/* ─── Shared wrapper for all static/policy pages ─── */
const StaticPageWrapper = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	useDocumentTitle(title);

	return (
		<div className="bg-white dark:bg-gray-900">
			<div className="mx-auto max-w-4xl px-4 py-10">
				<h1 className="mb-6 text-3xl font-bold tracking-tight">{title}</h1>
				<div className="space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">
					{children}
				</div>
			</div>
		</div>
	);
};

export default StaticPageWrapper;
