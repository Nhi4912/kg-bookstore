import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateVariantRequest } from "@kgbookstore/api-contract";
import { createVariantRequestSchema } from "@kgbookstore/api-contract";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants";
import { useCreateProductVariant } from "@/hooks/use-variants";

const CreateVariantPage = () => {
	const { id: productId } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const createMutation = useCreateProductVariant(productId!);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateVariantRequest>({
		resolver: zodResolver(createVariantRequestSchema),
		defaultValues: {
			sku: "",
			barcode: "",
			retail_price: 0,
			cost_price: 0,
			stock_quantity: 0,
		},
	});

	const onSubmit = async (data: CreateVariantRequest) => {
		try {
			await createMutation.mutateAsync(data);
			toast.success("Thêm biến thể thành công");
			navigate(ROUTES.PRODUCT_EDIT(productId!));
		} catch {
			toast.error("Không thể thêm biến thể. Vui lòng thử lại.");
		}
	};

	return (
		<PageWrapper
			title="Thêm biến thể"
			action={
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => navigate(ROUTES.PRODUCT_EDIT(productId!))}
					>
						Hủy
					</Button>
					<Button
						onClick={handleSubmit(onSubmit)}
						disabled={createMutation.isPending}
					>
						{createMutation.isPending ? "Đang lưu..." : "Lưu biến thể"}
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

export default CreateVariantPage;
