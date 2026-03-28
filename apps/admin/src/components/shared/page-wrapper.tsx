import type { ReactNode } from "react";

interface PageWrapperProps {
	title: string;
	action?: ReactNode;
	children: ReactNode;
}

const PageWrapper = ({ title, action, children }: PageWrapperProps) => {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				{action}
			</div>
			{children}
		</div>
	);
};

export default PageWrapper;
