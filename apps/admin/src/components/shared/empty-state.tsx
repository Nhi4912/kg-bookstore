import { Inbox } from "lucide-react";

interface EmptyStateProps {
	message?: string;
	icon?: React.ReactNode;
}

const EmptyState = ({
	message = "Không có dữ liệu",
	icon,
}: EmptyStateProps) => (
	<div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
		{icon ?? <Inbox className="size-8 opacity-50" />}
		<p className="text-sm">{message}</p>
	</div>
);

export default EmptyState;
