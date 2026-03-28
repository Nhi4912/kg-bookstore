import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateCollectionRequest } from "@kgbookstore/api-contract";
import { createCollectionRequestSchema } from "@kgbookstore/api-contract";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { useCreateCollection } from "@/hooks/use-collections";
import CollectionFormFields from "./collection-form-fields";

const CreateCollectionPage = () => {
	const navigate = useNavigate();
	const createMutation = useCreateCollection();

	const form = useForm<CreateCollectionRequest>({
		resolver: zodResolver(createCollectionRequestSchema),
		defaultValues: {
			title: "",
			tag: "SIGNATURE",
			description: "",
			is_visible: true,
			product_ids: [],
			image_url: "",
			size_guide: "",
		},
	});

	const handleSubmit = async (data: CreateCollectionRequest) => {
		try {
			await createMutation.mutateAsync(data);
			toast.success("Tạo nhóm sản phẩm thành công");
			navigate("/collections");
		} catch {
			toast.error("Không thể tạo nhóm sản phẩm");
		}
	};

	return (
		<PageWrapper
			title="Tạo nhóm sản phẩm"
			action={
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => navigate("/collections")}>
						Huỷ
					</Button>
					<Button
						onClick={form.handleSubmit(handleSubmit)}
						disabled={createMutation.isPending}
					>
						{createMutation.isPending ? "Đang lưu..." : "Lưu"}
					</Button>
				</div>
			}
		>
			<FormProvider {...form}>
				<CollectionFormFields />
			</FormProvider>
		</PageWrapper>
	);
};

export default CreateCollectionPage;
