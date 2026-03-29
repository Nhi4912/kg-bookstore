import { Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format";

const SearchBox = () => {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const debouncedQuery = useDebounce(query.trim(), 200);
	const { data, isFetching } = useSearchProducts(debouncedQuery);

	const results = data?.items ?? [];
	const total = data?.paging?.total ?? 0;
	const showDropdown = open && debouncedQuery.length >= 2;

	/* Close dropdown on click outside */
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = query.trim();
		if (trimmed) {
			navigate(`/product/search/${encodeURIComponent(trimmed)}`);
			setQuery("");
			setOpen(false);
		}
	};

	const handleResultClick = () => {
		setQuery("");
		setOpen(false);
	};

	const handleViewMore = () => {
		navigate(`/product/search/${encodeURIComponent(query.trim())}`);
		setQuery("");
		setOpen(false);
	};

	return (
		<div ref={wrapperRef} className="relative w-full">
			<form onSubmit={handleSubmit} className="relative">
				<Search
					size={18}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
				/>
				<input
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					placeholder="Tìm kiếm sản phẩm..."
					aria-label="Tìm kiếm sản phẩm"
					aria-expanded={showDropdown && results.length > 0}
					aria-haspopup="listbox"
					autoComplete="off"
					className="w-full rounded-full border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--color-brand-green)] focus:bg-white"
				/>
				{isFetching && (
					<Loader2
						size={16}
						className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
					/>
				)}
			</form>

			{/* Autocomplete dropdown */}
			{showDropdown && (results.length > 0 || isFetching) && (
				<div
					role="listbox"
					className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg"
				>
					{results.map((product) => {
						const imageUrl = product.images?.[0]?.url;
						const price = product.variants?.[0]?.retail_price ?? 0;

						return (
							<Link
								key={product.id}
								to={`/product/${product.id}`}
								onClick={handleResultClick}
								role="option"
								className="flex gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50"
							>
								{imageUrl ? (
									<img
										src={imageUrl}
										alt={product.name}
										className="h-[56px] w-[56px] shrink-0 rounded object-contain"
									/>
								) : (
									<div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">
										Ảnh
									</div>
								)}
								<div className="flex min-w-0 flex-1 flex-col justify-center">
									<p className="line-clamp-2 text-sm font-medium text-gray-800">
										{product.name}
									</p>
									<p className="mt-0.5 text-sm font-semibold text-[var(--color-brand-green)]">
										{formatCurrency(price)}
									</p>
								</div>
							</Link>
						);
					})}

					{/* "View more" button */}
					{total > 4 && (
						<button
							type="button"
							onClick={handleViewMore}
							className="w-full border-t px-3 py-2.5 text-center text-sm font-medium text-[var(--color-brand-green)] transition-colors hover:bg-gray-50"
						>
							Xem thêm {total - 4} sản phẩm
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchBox;
