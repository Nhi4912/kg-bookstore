import type { TagListResponse } from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useTags = () => {
	const query = useQuery({
		queryKey: ["tags"],
		queryFn: () => api.get<TagListResponse>("/tags"),
		staleTime: Infinity,
	});

	return { tagList: query.data?.items ?? [], ...query };
};
