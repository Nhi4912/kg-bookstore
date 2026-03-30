import { OrganizationJsonLd } from "@/components/seo/json-ld";
import SubscriptionForm from "@/components/shared/subscription-form";
import { useCanonicalUrl, useDocumentTitle } from "@/hooks/use-document-title";
import FeaturedCategories from "./featured-categories";
import HeroSection from "./hero-section";
import ProductsByTag from "./products-by-tag";

const HomePage = () => {
	useDocumentTitle("Trang chủ");
	useCanonicalUrl("/");

	return (
		<>
			<OrganizationJsonLd
				name="Nhà Sách Kiên Giang"
				url="https://nhasachkiengiang.com"
				description="Hệ thống nhà sách uy tín với đa dạng sách giáo khoa, văn phòng phẩm, đồ chơi giáo dục."
			/>
			<HeroSection />
			<FeaturedCategories />
			<ProductsByTag />
			<section className="bg-gradient-to-b from-[#fff6f6] to-[var(--color-brand-green)] py-12">
				<div className="mx-auto max-w-7xl px-4">
					<SubscriptionForm />
				</div>
			</section>
		</>
	);
};

export default HomePage;
