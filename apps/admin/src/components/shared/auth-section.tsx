import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthSectionProps {
	title: string;
	children: ReactNode;
	footerText?: string;
	footerLinkText?: string;
	footerLinkTo?: string;
}

const AuthSection = ({
	title,
	children,
	footerText,
	footerLinkText,
	footerLinkTo,
}: AuthSectionProps) => {
	return (
		<div className="flex min-h-screen items-start justify-center bg-body-bg pt-[20vh]">
			<div className="w-full max-w-[500px] space-y-6 px-4">
				<h1 className="text-center text-2xl font-semibold">{title}</h1>
				{children}
				{footerText && footerLinkTo && (
					<p className="text-center text-sm text-muted-foreground">
						{footerText}{" "}
						<Link
							to={footerLinkTo}
							className="font-medium text-primary hover:underline"
						>
							{footerLinkText}
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default AuthSection;
