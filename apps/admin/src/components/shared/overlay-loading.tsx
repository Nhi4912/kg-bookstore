import { Loader2 } from "lucide-react";

interface OverlayLoadingProps {
	visible: boolean;
}

const OverlayLoading = ({ visible }: OverlayLoadingProps) => {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-lg">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<span className="text-sm text-muted-foreground">Đang xử lý...</span>
			</div>
		</div>
	);
};

export default OverlayLoading;
