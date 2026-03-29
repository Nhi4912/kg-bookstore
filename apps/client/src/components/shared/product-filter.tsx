import { PRICE_RANGES } from "@/constants";
import { useVendors } from "@/hooks/use-vendors";

interface ProductFilterProps {
	selectedVendors: string[];
	selectedPrice: { from: number | null; to: number | null };
	onChangeVendors: (id: string) => void;
	onChangePrice: (from: number, to: number) => void;
}

const ProductFilter = ({
	selectedVendors,
	selectedPrice,
	onChangeVendors,
	onChangePrice,
}: ProductFilterProps) => {
	const { data: vendorData } = useVendors();
	const vendors = vendorData?.items ?? [];

	return (
		<div className="space-y-6">
			{/* Vendor filter */}
			{vendors.length > 0 ? (
				<div>
					<h4 className="mb-3 text-sm font-semibold">Lọc theo nhà cung cấp</h4>
					<div className="space-y-2">
						{vendors.map((vendor) => (
							<label
								key={vendor.id}
								className="flex items-center gap-2 text-sm"
							>
								<input
									type="checkbox"
									checked={selectedVendors.includes(vendor.id)}
									onChange={() => onChangeVendors(vendor.id)}
									className="rounded border-gray-300"
								/>
								{vendor.name}
							</label>
						))}
					</div>
				</div>
			) : null}

			{/* Price filter */}
			<div>
				<h4 className="mb-3 text-sm font-semibold">Lọc theo giá</h4>
				<div className="space-y-2">
					{PRICE_RANGES.map((range) => (
						<label
							key={range.label}
							className="flex items-center gap-2 text-sm"
						>
							<input
								type="radio"
								name="price-filter"
								checked={
									selectedPrice.from === range.from &&
									selectedPrice.to === range.to
								}
								onChange={() => onChangePrice(range.from, range.to)}
								className="border-gray-300"
							/>
							{range.label}
						</label>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductFilter;
