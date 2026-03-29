import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateCollectionRequest } from "@kgbookstore/api-contract";
import { updateCollectionRequestSchema } from "@kgbookstore/api-contract";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import LoadingState from "@/components/shared/loading-state";
import NotFoundState from "@/components/shared/not-found-state";
import PageWrapper from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import {
	useCollectionDetail,
	useDeleteCollection,
	useUpdateCollection,
} from "@/hooks/use-collections";
import CollectionFormFields from "./collection-form-fields";

const EditCollectionPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: collection, isLoading } = useCollectionDetail(id ?? "");
	const updateMutation = useUpdateCollection();
	const deleteMutation = useDeleteCollection();
	const [deleteOpen, setDeleteOpen] = useState(false);

	const form = useForm<UpdateCollectionRequest>({
		resolver: zodResolver(updateCollectionRequestSchema),
		values: collection
			? {
					title: collection.title,
					tag: collection.tag,
					description: collection.description,
					is_visible: collection.is_visible,
					size_guide: collection.size_guide ?? "",
					image_url: collection.image?.url ?? "",
				}
			: undefined,
	});

	const handleSubmit = async (data: UpdateCollectionRequest) => {
		if (!id) return;
		try {
			await updateMutation.mutateAsync({ id, data });
			toast.success("Cập nhật nhóm sản phẩm thành công");
			navigate("/collections");
		} catch {
			toast.error("Không thể cập nhật nhóm sản phẩm");
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Đã xoá nhóm sản phẩm");
			navigate("/collections");
		} catch {
			toast.error("Không thể xoá nhóm sản phẩm");
		}
	};

	if (isLoading) {
		return (
			<PageWrapper title="Chỉnh sửa nhóm sản phẩm">
				<LoadingState />
			</PageWrapper>
		);
	}

	if (!collection) {
		return (
			<PageWrapper title="Chỉnh sửa nhóm sản phẩm">
				<NotFoundState message="Không tìm thấy nhóm sản phẩm" />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper
			title="Chỉnh sửa nhóm sản phẩm"
			action={
				<div className="flex items-center gap-2">
					<Button
						variant="destructive"
						onClick={() => setDeleteOpen(true)}
						disabled={deleteMutation.isPending}
					>
						Xoá
					</Button>
					<Button variant="outline" onClick={() => navigate("/collections")}>
						Huỷ
					</Button>
					<Button
						onClick={form.handleSubmit(handleSubmit)}
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending ? "Đang lưu..." : "Cập nhật"}
					</Button>
				</div>
			}
		>
			<FormProvider {...form}>
				<CollectionFormFields />
			</FormProvider>

			<ConfirmDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				title="Xoá nhóm sản phẩm"
				description="Bạn có chắc chắn muốn xoá nhóm sản phẩm này? Hành động này không thể hoàn tác."
				confirmLabel="Xoá"
				isPending={deleteMutation.isPending}
				onConfirm={handleDelete}
			/>
		</PageWrapper>
	);
};

export default EditCollectionPage;
