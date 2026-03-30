import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
	const { resolvedTheme, toggle } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={toggle}
			aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
			className="rounded-full bg-gray-100 p-2.5 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
		>
			{isDark ? (
				<Sun size={20} className="text-yellow-500" />
			) : (
				<Moon size={20} className="text-gray-600" />
			)}
		</button>
	);
};

export default ThemeToggle;
