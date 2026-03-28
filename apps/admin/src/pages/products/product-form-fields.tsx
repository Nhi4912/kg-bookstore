import type { CreateProductRequest } from "@kgbookstore/api-contract";
import { useFormContext } from "react-hook-form";
import {
	CheckboxHF,
	FormSection,
	InputHF,
	SelectHF,
	TextareaHF,
} from "@/components/shared/form-fields";
import {
	useCategories,
	useCollections,
	useVendors,
} from "@/hooks/use-supporting";

interface ProductFormFieldsProps {
	isEdit?: boolean;
}

const ProductFormFields = ({ isEdit = false }: ProductFormFieldsProps) => {
	const { data: categoriesData } = useCategories();
	const { data: vendorsData } = useVendors();
	const { data: collectionsData } = useCollections();
	const {
		formState: { errors },
	} = useFormContext<CreateProductRequest>();

	const categoryOptions =
		categoriesData?.items.map((c) => ({ value: c.id, label: c.name })) ?? [];

	const vendorOptions =
		vendorsData?.items.map((v) => ({ value: v.id, label: v.name })) ?? [];

	const collectionOptions =
		collectionsData?.items.map((col) => ({
			value: col.id,
			label: col.title,
		})) ?? [];

	return (
		<div className="grid grid-cols-12 gap-6">
			{/* Left column — 8/12 */}
			<div className="col-span-12 space-y-6 lg:col-span-8">
				<FormSection title="Thông tin chung">
					<InputHF
						name="name"
						label="Tên sản phẩm"
						placeholder="Nhập tên sản phẩm"
						required
					/>
					<SelectHF
						name="category_id"
						label="Loại sản phẩm"
						placeholder="Chọn loại sản phẩm"
						options={categoryOptions}
						required
					/>
					<SelectHF
						name="vendor_id"
						label="Nhà cung cấp"
						placeholder="Chọn nhà cung cấp"
						options={vendorOptions}
					/>
					<TextareaHF
						name="description"
						label="Mô tả sản phẩm"
						placeholder="Nhập mô tả sản phẩm (HTML)"
						rows={6}
					/>
					<InputHF
						name="quote"
						label="Trích dẫn"
						placeholder="Nhập trích dẫn"
					/>
				</FormSection>

				{/* Image section — placeholder for now */}
				<FormSection title="Hình ảnh sản phẩm">
					<p className="text-sm text-muted-foreground">
						Chức năng upload hình ảnh sẽ được thêm sau.
					</p>
				</FormSection>

				{/* Variants section placeholder for create */}
				{!isEdit && (
					<FormSection title="Biến thể">
						<p className="text-sm text-muted-foreground">
							Bạn có thể thêm biến thể sau khi tạo sản phẩm.
						</p>
					</FormSection>
				)}
			</div>

			{/* Right column — 4/12 */}
			<div className="col-span-12 space-y-6 lg:col-span-4">
				<FormSection title="Nhóm sản phẩm">
					{collectionOptions.length > 0 ? (
						<div className="space-y-2">
							{collectionOptions.map((col) => (
								<CollectionCheckbox
									key={col.value}
									collectionId={col.value}
									label={col.label}
								/>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							Chưa có nhóm sản phẩm nào
						</p>
					)}
					{errors.collection_ids && (
						<p className="text-xs text-destructive">
							{errors.collection_ids.message as string}
						</p>
					)}
				</FormSection>

				<FormSection title="Trạng thái">
					<CheckboxHF name="is_visible" label="Hiển thị sản phẩm" />
				</FormSection>
			</div>
		</div>
	);
};

// ─── Collection Checkbox (multi-select via form array) ───

const CollectionCheckbox = ({
	collectionId,
	label,
}: {
	collectionId: string;
	label: string;
}) => {
	const { watch, setValue } = useFormContext<CreateProductRequest>();
	const currentIds = watch("collection_ids") ?? [];
	const isChecked = currentIds.includes(collectionId);

	const handleToggle = () => {
		const updated = isChecked
			? currentIds.filter((id) => id !== collectionId)
			: [...currentIds, collectionId];
		setValue("collection_ids", updated, { shouldDirty: true });
	};

	return (
		<div className="flex items-center gap-2">
			<input
				type="checkbox"
				id={`col-${collectionId}`}
				checked={isChecked}
				onChange={handleToggle}
				className="size-4 rounded border-border"
			/>
			<label htmlFor={`col-${collectionId}`} className="cursor-pointer text-sm">
				{label}
			</label>
		</div>
	);
};

export default ProductFormFields;
