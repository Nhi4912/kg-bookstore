import type { CreateCollectionRequest } from "@kgbookstore/api-contract";
import { useFormContext } from "react-hook-form";
import {
	CheckboxHF,
	FormSection,
	InputHF,
	SelectHF,
	TextareaHF,
} from "@/components/shared/form-fields";

const TAG_OPTIONS = [
	{ value: "SIGNATURE", label: "Signature" },
	{ value: "SPOTLIGHT", label: "Spotlight" },
] as const;

const CollectionFormFields = () => {
	useFormContext<CreateCollectionRequest>();

	return (
		<div className="grid grid-cols-12 gap-6">
			{/* Left column — 8/12 */}
			<div className="col-span-12 space-y-6 lg:col-span-8">
				<FormSection title="Thông tin chung">
					<div className="space-y-4">
						<InputHF
							name="title"
							label="Tên nhóm sản phẩm"
							placeholder="Nhập tên nhóm sản phẩm"
							required
						/>
						<SelectHF
							name="tag"
							label="Tag"
							options={[...TAG_OPTIONS]}
							required
						/>
						<TextareaHF
							name="description"
							label="Mô tả nhóm sản phẩm"
							placeholder="Nhập mô tả (hỗ trợ HTML)"
							rows={6}
						/>
						<TextareaHF
							name="size_guide"
							label="Hướng dẫn chọn size"
							placeholder="Nhập hướng dẫn chọn size (tuỳ chọn)"
							rows={4}
						/>
					</div>
				</FormSection>

				<FormSection title="Sản phẩm">
					<p className="text-sm text-muted-foreground">
						Chọn sản phẩm cho nhóm này (sẽ được triển khai sau)
					</p>
					{/* TODO: ProductSelectionDialog */}
				</FormSection>
			</div>

			{/* Right column — 4/12 */}
			<div className="col-span-12 space-y-6 lg:col-span-4">
				<FormSection title="Hình đại diện">
					<div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
						<p className="text-sm text-muted-foreground">
							Upload ảnh (sẽ được triển khai sau)
						</p>
					</div>
					{/* TODO: Image upload */}
				</FormSection>

				<FormSection title="Trạng thái">
					<CheckboxHF name="is_visible" label="Hiển thị nhóm sản phẩm" />
				</FormSection>
			</div>
		</div>
	);
};

export default CollectionFormFields;
