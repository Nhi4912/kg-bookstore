import type { MenuResponse } from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useMenus = () =>
	useQuery({
		queryKey: ["menus"],
		queryFn: () => api.get<MenuResponse>("/menus"),
		staleTime: Infinity,
	});
