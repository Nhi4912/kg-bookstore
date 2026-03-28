import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateVariantRequest } from "@kgbookstore/api-contract";
import { updateVariantRequestSchema } from "@kgbookstore/api-contract";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants";
import { useProductDetail } from "@/hooks/use-products";
import {
	useDeleteProductVariant,
	useUpdateProductVariant,
} from "@/hooks/use-variants";

const EditVariantPage = () => {
	const { id: productId, variantId } = useParams<{
		id: string;
		variantId: string;
	}>();
	const navigate = useNavigate();
	const { data: product } = useProductDetail(productId!);
	const updateMutation = useUpdateProductVariant(productId!);
	const deleteMutation = useDeleteProductVariant(productId!);

	const variant = product?.variants?.find((v) => v.id === variantId);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdateVariantRequest>({
		resolver: zodResolver(updateVariantRequestSchema),
		defaultValues: {
			sku: "",
			barcode: "",
			retail_price: 0,
			cost_price: 0,
			stock_quantity: 0,
		},
	});

	useEffect(() => {
		if (variant) {
			reset({
				sku: variant.sku,
				barcode: variant.barcode,
				retail_price: variant.retail_price,
				cost_price: variant.cost_price,
				stock_quantity: variant.stock_quantity,
			});
		}
	}, [variant, reset]);

	const onSubmit = async (data: UpdateVariantRequest) => {
		try {
			await updateMutation.mutateAsync({ variantId: variantId!, data });
			toast.success("Cập nhật biến thể thành công");
			navigate(ROUTES.PRODUCT_EDIT(productId!));
		} catch {
			toast.error("Không thể cập nhật biến thể. Vui lòng thử lại.");
		}
	};

	const handleDelete = async () => {
		if (!confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;
		try {
			await deleteMutation.mutateAsync(variantId!);
			toast.success("Đã xóa biến thể");
			navigate(ROUTES.PRODUCT_EDIT(productId!));
		} catch {
			toast.error("Không thể xóa biến thể");
		}
	};

	if (!variant && product) {
		return (
			<PageWrapper title="Chỉnh sửa biến thể">
				<div className="py-10 text-center text-muted-foreground">
					Không tìm thấy biến thể
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper
			title="Chỉnh sửa biến thể"
			action={
				<div className="flex items-center gap-2">
					<Button variant="destructive" onClick={handleDelete}>
						Xóa
					</Button>
					<Button
						variant="outline"
						onClick={() => navigate(ROUTES.PRODUCT_EDIT(productId!))}
					>
						Hủy
					</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</div>
			}
		>
			<PaperSection title="Thông tin biến thể">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-1 gap-4 md:grid-cols-2"
				>
					<div className="space-y-1.5">
						<Label htmlFor="sku">SKU</Label>
						<Input id="sku" placeholder="Nhập SKU" {...register("sku")} />
						{errors.sku && (
							<p className="text-xs text-destructive">{errors.sku.message}</p>
						)}
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="barcode">Barcode</Label>
						<Input
							id="barcode"
							placeholder="Nhập barcode"
							{...register("barcode")}
						/>
						{errors.barcode && (
							<p className="text-xs text-destructive">
								{errors.barcode.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="retail_price">Giá bán</Label>
						<Input
							id="retail_price"
							type="number"
							placeholder="0"
							{...register("retail_price", { valueAsNumber: true })}
						/>
						{errors.retail_price && (
							<p className="text-xs text-destructive">
								{errors.retail_price.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="cost_price">Giá vốn</Label>
						<Input
							id="cost_price"
							type="number"
							placeholder="0"
							{...register("cost_price", { valueAsNumber: true })}
						/>
						{errors.cost_price && (
							<p className="text-xs text-destructive">
								{errors.cost_price.message}
							</p>
						)}
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="stock_quantity">Số lượng tồn kho</Label>
						<Input
							id="stock_quantity"
							type="number"
							placeholder="0"
							{...register("stock_quantity", { valueAsNumber: true })}
						/>
						{errors.stock_quantity && (
							<p className="text-xs text-destructive">
								{errors.stock_quantity.message}
							</p>
						)}
					</div>
				</form>
			</PaperSection>
		</PageWrapper>
	);
};

export default EditVariantPage;
