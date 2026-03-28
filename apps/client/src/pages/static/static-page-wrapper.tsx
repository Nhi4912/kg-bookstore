/* ─── Shared wrapper for all static/policy pages ─── */
const StaticPageWrapper = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div className="bg-white">
		<div className="mx-auto max-w-4xl px-4 py-10">
			<h1 className="mb-6 text-2xl font-bold">{title}</h1>
			<div className="space-y-4 text-sm leading-relaxed text-gray-700">
				{children}
			</div>
		</div>
	</div>
);

export default StaticPageWrapper;
