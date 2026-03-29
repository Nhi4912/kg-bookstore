import type { VariantResponse } from "@kgbookstore/api-contract";

const VariantButton = ({
	variant,
	isSelected,
	onClick,
}: {
	variant: VariantResponse;
	isSelected: boolean;
	onClick: () => void;
}) => {
	const label =
		variant.attributes?.map((attr) => attr.value ?? attr.name).join(" / ") ??
		variant.sku;

	return (
		<button
			onClick={onClick}
			className={`rounded border px-3 py-1.5 text-xs transition-colors ${
				isSelected
					? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)] text-white"
					: "border-gray-300 hover:border-gray-400"
			}`}
		>
			{label}
		</button>
	);
};

export default VariantButton;
