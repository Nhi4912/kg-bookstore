import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateProductRequest } from "@kgbookstore/api-contract";
import { createProductRequestSchema } from "@kgbookstore/api-contract";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useCreateProduct } from "@/hooks/use-products";
import ProductFormFields from "./product-form-fields";

const CreateProductPage = () => {
	const navigate = useNavigate();
	const createMutation = useCreateProduct();

	const methods = useForm<CreateProductRequest>({
		resolver: zodResolver(createProductRequestSchema),
		defaultValues: {
			name: "",
			category_id: "",
			vendor_id: null,
			collection_ids: [],
			images: [],
			variants: [],
			description: "",
			quote: "",
			type: 0,
			is_visible: true,
		},
	});

	const handleSubmit = async (data: CreateProductRequest) => {
		try {
			const result = await createMutation.mutateAsync(data);
			toast.success("Tạo sản phẩm thành công");
			navigate(ROUTES.PRODUCT_EDIT(result.id));
		} catch {
			toast.error("Không thể tạo sản phẩm. Vui lòng thử lại.");
		}
	};

	return (
		<PageWrapper
			title="Tạo sản phẩm"
			action={
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => navigate(ROUTES.PRODUCTS)}>
						Hủy
					</Button>
					<Button
						onClick={methods.handleSubmit(handleSubmit)}
						disabled={createMutation.isPending}
					>
						{createMutation.isPending ? "Đang lưu..." : "Lưu sản phẩm"}
					</Button>
				</div>
			}
		>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(handleSubmit)}>
					<ProductFormFields />
				</form>
			</FormProvider>
		</PageWrapper>
	);
};

export default CreateProductPage;
