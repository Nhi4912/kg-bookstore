import type {
	AttributeListResponse,
	CategoryListResponse,
	VendorResponse,
} from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

// ─── Categories ───

const useCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () =>
			apiClient.get<CategoryListResponse>("/categories").then((r) => r.data),
	});
};

// ─── Vendors ───

interface VendorListResponse {
	items: VendorResponse[];
}

const useVendors = () => {
	return useQuery({
		queryKey: ["vendors"],
		queryFn: () =>
			apiClient.get<VendorListResponse>("/vendors").then((r) => r.data),
	});
};

// ─── Attributes ───

const useAttributes = () => {
	return useQuery({
		queryKey: ["attributes"],
		queryFn: () =>
			apiClient.get<AttributeListResponse>("/attributes").then((r) => r.data),
	});
};

export { useAttributes, useCategories, useVendors };
