import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

interface VendorResponse {
	id: string;
	name: string;
}

interface VendorListResponse {
	items: VendorResponse[];
}

export const useVendors = () =>
	useQuery({
		queryKey: ["vendors"],
		queryFn: () =>
			apiClient.get<VendorListResponse>("/vendors").then((r) => r.data),
		staleTime: Infinity,
	});
