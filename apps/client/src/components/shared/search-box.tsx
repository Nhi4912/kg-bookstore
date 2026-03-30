import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format";

const SearchBox = () => {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const navigate = useNavigate();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const debouncedQuery = useDebounce(query.trim(), 200);
	const { data, isFetching } = useSearchProducts(debouncedQuery);

	const results = data?.items ?? [];
	const total = data?.paging?.total ?? 0;
	const showDropdown = open && debouncedQuery.length >= 2;
	const hasViewMore = total > 4;
	// Total navigable items: results + optional "view more" button
	const totalOptions = results.length + (hasViewMore ? 1 : 0);

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

	const handleViewMore = useCallback(() => {
		navigate(`/product/search/${encodeURIComponent(query.trim())}`);
		setQuery("");
		setOpen(false);
	}, [navigate, query]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showDropdown || totalOptions === 0) return;

		switch (e.key) {
			case "ArrowDown": {
				e.preventDefault();
				setActiveIndex((prev) => (prev + 1) % totalOptions);
				break;
			}
			case "ArrowUp": {
				e.preventDefault();
				setActiveIndex((prev) => (prev <= 0 ? totalOptions - 1 : prev - 1));
				break;
			}
			case "Enter": {
				if (activeIndex === -1) return; // Let form submit handle it
				e.preventDefault();
				if (activeIndex < results.length) {
					navigate(`/product/${results[activeIndex].id}`);
					setQuery("");
					setOpen(false);
				} else if (hasViewMore) {
					handleViewMore();
				}
				break;
			}
			case "Escape": {
				setOpen(false);
				inputRef.current?.blur();
				break;
			}
		}
	};

	const activeDescendant =
		activeIndex >= 0 && activeIndex < results.length
			? `search-option-${results[activeIndex].id}`
			: activeIndex >= results.length && hasViewMore
				? "search-view-more"
				: undefined;

	return (
		<div ref={wrapperRef} className="relative w-full">
			<form onSubmit={handleSubmit} className="relative">
				<Search
					size={18}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
				/>
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setOpen(true);
						setActiveIndex(-1);
					}}
					onFocus={() => setOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder="Tìm kiếm sản phẩm..."
					role="combobox"
					aria-label="Tìm kiếm sản phẩm"
					aria-expanded={showDropdown && totalOptions > 0}
					aria-haspopup="listbox"
					aria-controls="search-listbox"
					aria-activedescendant={activeDescendant}
					autoComplete="off"
					className="w-full rounded-full border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--color-brand-green)] focus:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800"
				/>
				{isFetching ? (
					<Loader2
						size={16}
						className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
					/>
				) : null}
			</form>

			{/* Autocomplete dropdown */}
			{showDropdown && (results.length > 0 || isFetching) ? (
				<div
					id="search-listbox"
					role="listbox"
					className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
				>
					{results.map((product, idx) => {
						const imageUrl = product.images?.[0]?.url;
						const price = product.variants?.[0]?.retail_price ?? 0;

						return (
							<Link
								key={product.id}
								id={`search-option-${product.id}`}
								to={`/product/${product.id}`}
								onClick={handleResultClick}
								role="option"
								aria-selected={activeIndex === idx}
								className={`flex gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
									activeIndex === idx ? "bg-gray-50 dark:bg-gray-700" : ""
								}`}
							>
								{imageUrl ? (
									<img
										src={imageUrl}
										alt={product.name}
										width={56}
										height={56}
										className="h-[56px] w-[56px] shrink-0 rounded object-contain"
									/>
								) : (
									<div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400 dark:bg-gray-700 dark:text-gray-500">
										Ảnh
									</div>
								)}
								<div className="flex min-w-0 flex-1 flex-col justify-center">
									<p className="line-clamp-2 text-sm font-medium text-gray-800 dark:text-gray-200">
										{product.name}
									</p>
									<p className="mt-0.5 text-sm font-semibold text-[var(--color-brand-green-text)]">
										{formatCurrency(price)}
									</p>
								</div>
							</Link>
						);
					})}

					{/* "View more" button */}
					{hasViewMore ? (
						<button
							id="search-view-more"
							type="button"
							role="option"
							aria-selected={activeIndex === results.length}
							onClick={handleViewMore}
							className={`w-full border-t px-3 py-2.5 text-center text-sm font-medium text-[var(--color-brand-green-text)] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
								activeIndex === results.length
									? "bg-gray-50 dark:bg-gray-700"
									: ""
							}`}
						>
							Xem thêm {total - 4} sản phẩm
						</button>
					) : null}
				</div>
			) : null}
		</div>
	);
};

export default SearchBox;
