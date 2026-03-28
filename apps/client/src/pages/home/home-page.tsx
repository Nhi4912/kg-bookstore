import SubscriptionForm from "@/components/shared/subscription-form";
import FeaturedCategories from "./featured-categories";
import HeroSection from "./hero-section";
import ProductsByTag from "./products-by-tag";

const HomePage = () => (
	<>
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

export default HomePage;
