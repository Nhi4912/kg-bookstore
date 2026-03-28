import type { MenuResponse } from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const useMenus = () =>
	useQuery({
		queryKey: ["menus"],
		queryFn: () => apiClient.get<MenuResponse>("/menus").then((r) => r.data),
		staleTime: Infinity,
	});
