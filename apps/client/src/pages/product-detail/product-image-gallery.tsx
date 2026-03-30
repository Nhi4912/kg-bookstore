import type { ImageResponse } from "@kgbookstore/api-contract";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProductImageGalleryProps {
	images: ImageResponse[];
	productName: string;
}

const ProductImageGallery = ({
	images,
	productName,
}: ProductImageGalleryProps) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const thumbnailsRef = useRef<HTMLDivElement>(null);

	const currentImage = images[selectedIndex];
	const hasManyImages = images.length > 1;

	const goTo = useCallback(
		(index: number) => {
			const next = (index + images.length) % images.length;
			setSelectedIndex(next);
		},
		[images.length],
	);

	const goPrev = useCallback(
		() => goTo(selectedIndex - 1),
		[goTo, selectedIndex],
	);
	const goNext = useCallback(
		() => goTo(selectedIndex + 1),
		[goTo, selectedIndex],
	);

	const openZoom = useCallback(() => {
		setIsZoomed(true);
		dialogRef.current?.showModal();
	}, []);

	const closeZoom = useCallback(() => {
		setIsZoomed(false);
		dialogRef.current?.close();
	}, []);

	// Scroll selected thumbnail into view
	useEffect(() => {
		const container = thumbnailsRef.current;
		if (!container) return;
		const thumb = container.children[selectedIndex] as HTMLElement | undefined;
		thumb?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}, [selectedIndex]);

	// Keyboard nav for lightbox
	useEffect(() => {
		if (!isZoomed) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") goPrev();
			else if (e.key === "ArrowRight") goNext();
			else if (e.key === "Escape") closeZoom();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [isZoomed, goPrev, goNext, closeZoom]);

	if (images.length === 0) {
		return (
			<div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-400">
				Không có ảnh
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{/* Main image */}
			<div className="group relative">
				<button
					type="button"
					onClick={openZoom}
					className="relative flex w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border bg-white"
					aria-label={`Phóng to ảnh ${currentImage?.alt || productName}`}
				>
					<img
						src={currentImage?.url}
						alt={
							currentImage?.alt || `${productName} - Ảnh ${selectedIndex + 1}`
						}
						className="h-auto max-h-[400px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
						width={400}
						height={400}
					/>
					<span className="absolute bottom-3 right-3 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
						<ZoomIn size={18} />
					</span>
				</button>

				{/* Prev/Next arrows on main image */}
				{hasManyImages ? (
					<>
						<button
							type="button"
							onClick={goPrev}
							className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white"
							aria-label="Ảnh trước"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							type="button"
							onClick={goNext}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-colors hover:bg-white"
							aria-label="Ảnh tiếp theo"
						>
							<ChevronRight size={20} />
						</button>
					</>
				) : null}
			</div>

			{/* Thumbnails */}
			{hasManyImages ? (
				<div
					ref={thumbnailsRef}
					className="flex gap-2 overflow-x-auto pb-1"
					role="tablist"
					aria-label="Ảnh sản phẩm"
				>
					{images.map((img, index) => (
						<button
							key={img.id}
							type="button"
							role="tab"
							aria-selected={index === selectedIndex}
							aria-label={`Ảnh ${index + 1} / ${images.length}`}
							onClick={() => setSelectedIndex(index)}
							className={`flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
								index === selectedIndex
									? "border-[var(--color-brand-green)]"
									: "border-transparent hover:border-gray-300"
							}`}
						>
							<img
								src={img.url}
								alt={img.alt || `${productName} - Ảnh thu nhỏ ${index + 1}`}
								className="h-16 w-16 object-cover"
								width={64}
								height={64}
								loading="lazy"
							/>
						</button>
					))}
				</div>
			) : null}

			{/* Lightbox dialog */}
			<dialog
				ref={dialogRef}
				className="fixed inset-0 z-50 m-0 h-full max-h-full w-full max-w-full bg-black/90 p-0 backdrop:bg-transparent"
				aria-label={`Xem ảnh ${productName}`}
				onClose={closeZoom}
			>
				<div className="flex h-full w-full flex-col items-center justify-center">
					{/* Close button */}
					<button
						type="button"
						onClick={closeZoom}
						className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
						aria-label="Đóng xem ảnh"
					>
						<X size={24} />
					</button>

					{/* Counter */}
					{hasManyImages ? (
						<div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white">
							{selectedIndex + 1} / {images.length}
						</div>
					) : null}

					{/* Main zoomed image */}
					<img
						src={currentImage?.url}
						alt={
							currentImage?.alt || `${productName} - Ảnh ${selectedIndex + 1}`
						}
						className="max-h-[85vh] max-w-[90vw] object-contain"
					/>

					{/* Navigation arrows */}
					{hasManyImages ? (
						<>
							<button
								type="button"
								onClick={goPrev}
								className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40"
								aria-label="Ảnh trước"
							>
								<ChevronLeft size={28} />
							</button>
							<button
								type="button"
								onClick={goNext}
								className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40"
								aria-label="Ảnh tiếp theo"
							>
								<ChevronRight size={28} />
							</button>
						</>
					) : null}
				</div>
			</dialog>
		</div>
	);
};

export default ProductImageGallery;
