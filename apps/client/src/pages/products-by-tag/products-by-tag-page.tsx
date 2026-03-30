import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/shared/breadcrumb";
import ProductGrid from "@/components/shared/product-grid";
import ProductListLayout from "@/components/shared/product-list-layout";
import { useCanonicalUrl, useDocumentTitle } from "@/hooks/use-document-title";
import { useProductQuery } from "@/hooks/use-product-query";
import { useTags } from "@/hooks/use-tags";

const BANNER_URL =
	"https://theme.hstatic.net/200000427867/1000902683/14/collection_banner.jpg?v=6";

const TagBanner = () => (
	<div
		className="mb-8 h-[140px] overflow-hidden rounded-lg bg-cover bg-center sm:h-[200px]"
		style={{ backgroundImage: `url('${BANNER_URL}')` }}
	/>
);

const ProductsByTagPage = () => {
	const { id = "" } = useParams<{ id: string }>();
	const { tagList } = useTags();

	const currentTag = useMemo(
		() => tagList.find((t) => t.tag_id === id),
		[tagList, id],
	);

	const defaultQuery = useMemo(
		() =>
			currentTag?.collection_ids?.length
				? { collection_ids: JSON.stringify(currentTag.collection_ids) }
				: {},
		[currentTag],
	);

	const productQuery = useProductQuery(defaultQuery);

	useDocumentTitle(currentTag?.tag_name ?? "");
	useCanonicalUrl(id ? `/products/tag/${id}` : undefined);

	return (
		<ProductListLayout
			title={currentTag?.tag_name ?? ""}
			subtitle={`${productQuery.total} sản phẩm`}
			headerSlot={
				<>
					<Breadcrumb items={[{ label: currentTag?.tag_name ?? "" }]} />
					<TagBanner />
				</>
			}
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

export default ProductsByTagPage;
