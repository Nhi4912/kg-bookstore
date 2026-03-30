import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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
	const [reducedMotion, setReducedMotion] = useState(
		() =>
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	);
	const [isPlaying, setIsPlaying] = useState(
		() =>
			typeof window === "undefined" ||
			!window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	);

	const next = useCallback(
		() => setCurrent((prev) => (prev + 1) % SLIDES.length),
		[],
	);

	const prev = useCallback(
		() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length),
		[],
	);

	/* Listen for reduced motion preference changes */
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

		const handler = (e: MediaQueryListEvent) => {
			setReducedMotion(e.matches);
			if (e.matches) setIsPlaying(false);
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	/* Preload only the first image for fast LCP, lazy-load the rest */
	useEffect(() => {
		let cancelled = false;

		const firstImg = new Image();
		firstImg.src = SLIDES[0];
		const onReady = () => {
			if (!cancelled) setLoaded(true);
		};
		firstImg.onload = onReady;
		firstImg.onerror = onReady;

		// Preload remaining slides in the background after first is ready
		firstImg.addEventListener("load", () => {
			for (let i = 1; i < SLIDES.length; i++) {
				const img = new Image();
				img.src = SLIDES[i];
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	/* Auto-advance only after images loaded and playing */
	useEffect(() => {
		if (!loaded || !isPlaying) return;
		const timer = setInterval(next, 5000);
		return () => clearInterval(timer);
	}, [loaded, isPlaying, next]);

	const toggleAutoPlay = useCallback(() => {
		setIsPlaying((p) => !p);
	}, []);

	return (
		<section
			className="relative mb-10 overflow-hidden bg-white"
			aria-roledescription="carousel"
			aria-label="Banner khuyến mãi"
		>
			<div className="relative mx-auto max-w-7xl">
				{!loaded ? (
					<BannerSkeleton />
				) : (
					<>
						{/* Slide panels */}
						<div className="relative aspect-[1202/401] w-full overflow-hidden">
							{SLIDES.map((src, idx) => (
								<div
									key={idx}
									role="tabpanel"
									id={`slide-panel-${idx}`}
									aria-roledescription="slide"
									aria-label={`Slide ${idx + 1} trên ${SLIDES.length}`}
									aria-hidden={idx !== current}
									className={`absolute inset-0 ${
										reducedMotion
											? idx === current
												? "visible"
												: "invisible"
											: `transition-opacity duration-500 ${
													idx === current
														? "opacity-100"
														: "opacity-0 pointer-events-none"
												}`
									}`}
								>
									<Link
										to="/collection/all"
										tabIndex={idx === current ? 0 : -1}
									>
										<img
											src={src}
											alt={`Banner ${idx + 1}`}
											className="h-full w-full object-cover"
											{...(idx === 0
												? { fetchPriority: "high" }
												: { loading: "lazy" })}
										/>
									</Link>
								</div>
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

						{/* Controls: dots + play/pause */}
						<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3">
							{/* Play/Pause */}
							<button
								onClick={toggleAutoPlay}
								className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow transition-colors hover:bg-white"
								aria-label={
									isPlaying ? "Tạm dừng trình chiếu" : "Tiếp tục trình chiếu"
								}
							>
								{isPlaying ? <Pause size={12} /> : <Play size={12} />}
							</button>

							{/* Tab dots */}
							<div role="tablist" aria-label="Chọn slide">
								{SLIDES.map((_, idx) => (
									<button
										key={idx}
										role="tab"
										aria-selected={idx === current}
										aria-controls={`slide-panel-${idx}`}
										onClick={() => setCurrent(idx)}
										className={`mx-1 h-2.5 w-2.5 rounded-full border border-white transition-colors ${
											idx === current ? "bg-white" : "bg-white/40"
										}`}
										aria-label={`Slide ${idx + 1}`}
									/>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default HeroSection;
