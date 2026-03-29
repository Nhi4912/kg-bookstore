import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "@/components/shared/product-grid";
import ProductListLayout from "@/components/shared/product-list-layout";
import { useProductQuery } from "@/hooks/use-product-query";

const SearchHeader = ({ name, total }: { name: string; total: number }) => (
	<div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
		<h1 className="text-lg font-semibold">
			Kết quả tìm kiếm cho &ldquo;{name}&rdquo;
		</h1>
		<p className="text-sm text-gray-500">
			Có <strong>{total}</strong> sản phẩm cho tìm kiếm
		</p>
	</div>
);

const ProductSearchPage = () => {
	const { name = "" } = useParams<{ name: string }>();
	const defaultQuery = useMemo(() => ({ name }), [name]);
	const productQuery = useProductQuery(defaultQuery);

	return (
		<ProductListLayout
			title=""
			headerSlot={<SearchHeader name={name} total={productQuery.total} />}
			productQuery={productQuery}
		>
			<ProductGrid
				products={productQuery.listProducts}
				isLoading={productQuery.isLoading}
				isError={productQuery.isError}
				onRetry={productQuery.retry}
			/>
		</ProductListLayout>
	);
};

export default ProductSearchPage;
