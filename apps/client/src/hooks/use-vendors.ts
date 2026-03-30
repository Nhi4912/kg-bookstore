import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
		queryFn: () => api.get<VendorListResponse>("/vendors"),
		staleTime: Infinity,
	});
