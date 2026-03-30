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
			aria-pressed={isSelected}
			className={`rounded border px-3 py-2.5 text-sm transition-colors ${
				isSelected
					? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)] text-white"
					: "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-500"
			}`}
		>
			{label}
		</button>
	);
};

export default VariantButton;
