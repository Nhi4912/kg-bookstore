import type { CollectionResponse } from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export const useCollectionDetail = (id: string) =>
	useQuery({
		queryKey: ["collection", id],
		queryFn: () =>
			apiClient
				.get<CollectionResponse>(`/collections/${id}`)
				.then((r) => r.data),
		enabled: !!id,
	});
