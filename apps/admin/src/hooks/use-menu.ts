import type {
	MenuResponse,
	UpsertMenuRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

const menuKeys = {
	all: ["menus"] as const,
	tree: () => [...menuKeys.all, "tree"] as const,
};

export const useMenu = () => {
	return useQuery({
		queryKey: menuKeys.tree(),
		queryFn: () =>
			apiClient.get<MenuResponse>("/menus/with-admin").then((r) => r.data),
	});
};

export const useUpsertMenu = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpsertMenuRequest) =>
			apiClient.post("/menus/with-admin", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: menuKeys.all });
		},
	});
};
