import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "destructive" | "default";
	isPending?: boolean;
	onConfirm: () => void;
}

const ConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Xác nhận",
	cancelLabel = "Hủy",
	variant = "destructive",
	isPending = false,
	onConfirm,
}: ConfirmDialogProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent showCloseButton={false}>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				{description ? (
					<DialogDescription>{description}</DialogDescription>
				) : null}
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="outline"
					onClick={() => onOpenChange(false)}
					disabled={isPending}
				>
					{cancelLabel}
				</Button>
				<Button variant={variant} onClick={onConfirm} disabled={isPending}>
					{isPending ? "Đang xử lý..." : confirmLabel}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

export default ConfirmDialog;
