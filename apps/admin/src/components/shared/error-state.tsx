import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
}

const ErrorState = ({
	message = "Đã xảy ra lỗi. Vui lòng thử lại.",
	onRetry,
}: ErrorStateProps) => (
	<div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
		<AlertTriangle className="size-8 text-destructive opacity-70" />
		<p className="text-sm">{message}</p>
		{onRetry ? (
			<Button variant="outline" size="sm" onClick={onRetry}>
				Thử lại
			</Button>
		) : null}
	</div>
);

export default ErrorState;
