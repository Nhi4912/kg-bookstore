import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaperSectionProps {
	title?: string;
	children: ReactNode;
	className?: string;
}

const PaperSection = ({ title, children, className }: PaperSectionProps) => {
	return (
		<Card className={className}>
			{title && (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			)}
			<CardContent className={title ? undefined : "pt-6"}>
				{children}
			</CardContent>
		</Card>
	);
};

export default PaperSection;
