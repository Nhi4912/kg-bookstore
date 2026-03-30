import type {
	MenuResponse,
	UpsertMenuRequest,
} from "@kgbookstore/api-contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const menuKeys = {
	all: ["menus"] as const,
	tree: () => [...menuKeys.all, "tree"] as const,
};

export const useMenu = () => {
	return useQuery({
		queryKey: menuKeys.tree(),
		queryFn: () => api.get<MenuResponse>("/menus/with-admin"),
	});
};

export const useUpsertMenu = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpsertMenuRequest) =>
			api.post("/menus/with-admin", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: menuKeys.all });
		},
	});
};
