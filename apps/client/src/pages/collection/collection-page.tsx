import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "@/components/shared/product-grid";
import ProductListLayout from "@/components/shared/product-list-layout";
import { useCollectionDetail } from "@/hooks/use-collections";
import { useProductQuery } from "@/hooks/use-product-query";

const BANNER_URL =
	"https://theme.hstatic.net/200000427867/1000902683/14/collection_banner.jpg?v=6";

const CollectionBanner = () => (
	<div
		className="mb-8 h-[140px] overflow-hidden rounded-lg bg-cover bg-center sm:h-[200px]"
		style={{ backgroundImage: `url('${BANNER_URL}')` }}
	/>
);

const CollectionPage = () => {
	const { id = "" } = useParams<{ id: string }>();
	const isAll = id === "all";

	const defaultQuery = useMemo(
		() => (isAll ? {} : { collection_ids: JSON.stringify([id]) }),
		[id, isAll],
	);

	const productQuery = useProductQuery(defaultQuery);
	const { data: collection } = useCollectionDetail(isAll ? "" : id);
	const title = isAll ? "Tất cả sản phẩm" : (collection?.title ?? "");

	return (
		<ProductListLayout
			title={title}
			subtitle={`${productQuery.total} sản phẩm`}
			headerSlot={<CollectionBanner />}
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

export default CollectionPage;
