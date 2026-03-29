import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bannerImg1 from "@/assets/images/slide_1_img.jpeg";
import bannerImg2 from "@/assets/images/slide_2_img.jpeg";

const SLIDES = [bannerImg1, bannerImg2] as const;

/* ─── Skeleton shown while images load ─── */
const BannerSkeleton = () => (
	<div className="aspect-[1202/401] w-full animate-pulse rounded bg-gray-200" />
);

const HeroSection = () => {
	const [current, setCurrent] = useState(0);
	const [loaded, setLoaded] = useState(false);

	const next = useCallback(
		() => setCurrent((prev) => (prev + 1) % SLIDES.length),
		[],
	);

	const prev = useCallback(
		() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length),
		[],
	);

	/* Preload all images, then reveal carousel */
	useEffect(() => {
		let cancelled = false;

		const preload = SLIDES.map(
			(src) =>
				new Promise<void>((resolve) => {
					const img = new Image();
					img.src = src;
					img.onload = () => resolve();
					img.onerror = () => resolve(); // still show even if one fails
				}),
		);

		Promise.all(preload).then(() => {
			if (!cancelled) setLoaded(true);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	/* Auto-advance only after images loaded */
	useEffect(() => {
		if (!loaded) return;
		const timer = setInterval(next, 5000);
		return () => clearInterval(timer);
	}, [loaded, next]);

	return (
		<section className="relative mb-10 overflow-hidden bg-white">
			<div className="relative mx-auto max-w-7xl">
				{!loaded ? (
					<BannerSkeleton />
				) : (
					<>
						<div className="relative aspect-[1202/401] w-full overflow-hidden">
							{SLIDES.map((src, idx) => (
								<Link
									key={idx}
									to="/collection/all"
									className={`absolute inset-0 transition-opacity duration-500 ${
										idx === current
											? "opacity-100"
											: "opacity-0 pointer-events-none"
									}`}
								>
									<img
										src={src}
										alt={`Banner ${idx + 1}`}
										className="h-full w-full object-cover"
									/>
								</Link>
							))}
						</div>

						{/* Arrows */}
						<button
							onClick={prev}
							className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition-colors hover:bg-white"
							aria-label="Ảnh trước"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							onClick={next}
							className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition-colors hover:bg-white"
							aria-label="Ảnh sau"
						>
							<ChevronRight size={20} />
						</button>

						{/* Dots */}
						<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
							{SLIDES.map((_, idx) => (
								<button
									key={idx}
									onClick={() => setCurrent(idx)}
									className={`h-2.5 w-2.5 rounded-full border border-white transition-colors ${
										idx === current ? "bg-white" : "bg-white/40"
									}`}
									aria-label={`Slide ${idx + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default HeroSection;
