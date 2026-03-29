import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = query.trim();
		if (trimmed) {
			navigate(`/product/search/${encodeURIComponent(trimmed)}`);
			setQuery("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="relative w-full">
			<Search
				size={18}
				className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
			/>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Tìm kiếm sản phẩm..."
				aria-label="Tìm kiếm sản phẩm"
				className="w-full rounded-full border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--color-brand-green)] focus:bg-white"
			/>
		</form>
	);
};

export default SearchBox;
