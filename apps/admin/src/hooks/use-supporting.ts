import type {
	AttributeListResponse,
	CategoryListResponse,
	VendorResponse,
} from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ─── Categories ───

const useCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => api.get<CategoryListResponse>("/categories"),
	});
};

// ─── Vendors ───

interface VendorListResponse {
	items: VendorResponse[];
}

const useVendors = () => {
	return useQuery({
		queryKey: ["vendors"],
		queryFn: () => api.get<VendorListResponse>("/vendors"),
	});
};

// ─── Attributes ───

const useAttributes = () => {
	return useQuery({
		queryKey: ["attributes"],
		queryFn: () => api.get<AttributeListResponse>("/attributes"),
	});
};

export { useAttributes, useCategories, useVendors };
