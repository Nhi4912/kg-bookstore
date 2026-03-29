import { SearchX } from "lucide-react";

interface NotFoundStateProps {
	message?: string;
}

const NotFoundState = ({
	message = "Không tìm thấy dữ liệu",
}: NotFoundStateProps) => (
	<div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
		<SearchX className="size-8 opacity-50" />
		<p className="text-sm">{message}</p>
	</div>
);

export default NotFoundState;
