import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export interface SpecialTagCollection {
	collection_id: string;
	collection_name: string;
}

export interface SpecialTagResponse {
	tag_id: string;
	tag_name: string;
	collections: SpecialTagCollection[];
}

export const useSpecialTag = () =>
	useQuery({
		queryKey: ["tags", "special"],
		queryFn: () =>
			apiClient.get<SpecialTagResponse>("/tags/special").then((r) => r.data),
		staleTime: Infinity,
	});
