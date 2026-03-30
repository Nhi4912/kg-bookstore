interface OrganizationJsonLdProps {
	name: string;
	url: string;
	description: string;
}

export const OrganizationJsonLd = ({
	name,
	url,
	description,
}: OrganizationJsonLdProps) => (
	<script
		type="application/ld+json"
		// biome-ignore lint: dangerouslySetInnerHTML is needed for JSON-LD
		dangerouslySetInnerHTML={{
			__html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name,
				url,
				description,
			}),
		}}
	/>
);

interface ProductJsonLdProps {
	name: string;
	description: string;
	image: string;
	price: number;
	currency?: string;
	availability?: "InStock" | "OutOfStock";
	url: string;
}

export const ProductJsonLd = ({
	name,
	description,
	image,
	price,
	currency = "VND",
	availability = "InStock",
	url,
}: ProductJsonLdProps) => (
	<script
		type="application/ld+json"
		// biome-ignore lint: dangerouslySetInnerHTML is needed for JSON-LD
		dangerouslySetInnerHTML={{
			__html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Product",
				name,
				description,
				image,
				url,
				offers: {
					"@type": "Offer",
					price,
					priceCurrency: currency,
					availability: `https://schema.org/${availability}`,
				},
			}),
		}}
	/>
);

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbJsonLdProps {
	items: BreadcrumbItem[];
}

export const BreadcrumbJsonLd = ({ items }: BreadcrumbJsonLdProps) => (
	<script
		type="application/ld+json"
		// biome-ignore lint: dangerouslySetInnerHTML is needed for JSON-LD
		dangerouslySetInnerHTML={{
			__html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: items.map((item, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: item.name,
					item: item.url,
				})),
			}),
		}}
	/>
);
