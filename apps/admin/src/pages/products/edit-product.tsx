import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateProductRequest } from "@kgbookstore/api-contract";
import { updateProductRequestSchema } from "@kgbookstore/api-contract";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import {
	useDeleteProduct,
	useProductDetail,
	useUpdateProduct,
} from "@/hooks/use-products";
import ProductFormFields from "./product-form-fields";
import VariantList from "./variant-list";

const EditProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: product, isLoading } = useProductDetail(id!);
	const updateMutation = useUpdateProduct();
	const deleteMutation = useDeleteProduct();

	const methods = useForm<UpdateProductRequest>({
		resolver: zodResolver(updateProductRequestSchema),
		defaultValues: {
			name: "",
			category_id: null,
			vendor_id: null,
			collection_ids: [],
			description: "",
			quote: "",
			type: 0,
			is_visible: true,
		},
	});

	useEffect(() => {
		if (product) {
			methods.reset({
				name: product.name,
				category_id: product.category_id,
				vendor_id: product.vendor_id,
				collection_ids: product.collection_ids,
				description: product.description,
				quote: product.quote,
				type: product.type,
				is_visible: product.is_visible,
			});
		}
	}, [product, methods]);

	const handleSubmit = async (data: UpdateProductRequest) => {
		try {
			await updateMutation.mutateAsync({ id: id!, data });
			toast.success("Cập nhật sản phẩm thành công");
		} catch {
			toast.error("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
		}
	};

	const handleDelete = async () => {
		if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
		try {
			await deleteMutation.mutateAsync(id!);
			toast.success("Đã xóa sản phẩm");
			navigate(ROUTES.PRODUCTS);
		} catch {
			toast.error("Không thể xóa sản phẩm. Vui lòng thử lại.");
		}
	};

	if (isLoading) {
		return (
			<PageWrapper title="Chỉnh sửa sản phẩm">
				<div className="py-10 text-center text-muted-foreground">
					Đang tải...
				</div>
			</PageWrapper>
		);
	}

	if (!product) {
		return (
			<PageWrapper title="Chỉnh sửa sản phẩm">
				<div className="py-10 text-center text-muted-foreground">
					Không tìm thấy sản phẩm
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper
			title="Chỉnh sửa sản phẩm"
			action={
				<div className="flex items-center gap-2">
					<Button variant="destructive" onClick={handleDelete}>
						Xóa
					</Button>
					<Button variant="outline" onClick={() => navigate(ROUTES.PRODUCTS)}>
						Hủy
					</Button>
					<Button
						onClick={methods.handleSubmit(handleSubmit)}
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</div>
			}
		>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(handleSubmit)}>
					<ProductFormFields isEdit />
				</form>
			</FormProvider>

			{/* Variants section — edit mode only */}
			<PaperSection title="Biến thể" className="mt-6">
				<VariantList productId={id!} variants={product.variants ?? []} />
			</PaperSection>
		</PageWrapper>
	);
};

export default EditProductPage;
