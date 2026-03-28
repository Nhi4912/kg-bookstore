import type { TagListResponse } from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const useTags = () => {
	const query = useQuery({
		queryKey: ["tags"],
		queryFn: () => apiClient.get<TagListResponse>("/tags").then((r) => r.data),
		staleTime: Infinity,
	});

	return { tagList: query.data?.items ?? [], ...query };
};
