export const COLLECTION_TAG_OPTIONS = [
	{ value: "", label: "Tất cả" },
	{ value: "SIGNATURE", label: "Signature" },
	{ value: "SPOTLIGHT", label: "Spotlight" },
] as const;

export const COLLECTION_VISIBILITY_OPTIONS = [
	{ value: "", label: "Tất cả" },
	{ value: "true", label: "Hiển thị" },
	{ value: "false", label: "Ẩn" },
] as const;

export const COLLECTION_SORT_OPTIONS = [
	{ value: "created_at-desc", label: "Mới nhất" },
	{ value: "created_at-asc", label: "Cũ nhất" },
	{ value: "title-asc", label: "Tên A-Z" },
	{ value: "title-desc", label: "Tên Z-A" },
] as const;
