import type { CollectionResponse } from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCollectionDetail = (id: string) =>
	useQuery({
		queryKey: ["collection", id],
		queryFn: () => api.get<CollectionResponse>(`/collections/${id}`),
		enabled: !!id,
	});
