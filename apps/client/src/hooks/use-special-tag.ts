import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
		queryFn: () => api.get<SpecialTagResponse>("/tags/special"),
		staleTime: Infinity,
	});
