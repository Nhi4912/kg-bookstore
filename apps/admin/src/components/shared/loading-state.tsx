import { Loader2 } from "lucide-react";

interface LoadingStateProps {
	message?: string;
}

const LoadingState = ({ message = "Đang tải..." }: LoadingStateProps) => (
	<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
		<Loader2 className="size-4 animate-spin" />
		<span className="text-sm">{message}</span>
	</div>
);

export default LoadingState;
