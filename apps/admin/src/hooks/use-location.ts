import type {
	DistrictListResponse,
	ProvinceListResponse,
	WardListResponse,
} from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

const locationKeys = {
	provinces: (name?: string) => ["provinces", name] as const,
	districts: (provinceId?: string, name?: string) =>
		["districts", provinceId, name] as const,
	wards: (districtId?: string, name?: string) =>
		["wards", districtId, name] as const,
};

const useProvinces = (name?: string) => {
	return useQuery({
		queryKey: locationKeys.provinces(name),
		queryFn: () =>
			apiClient
				.get<ProvinceListResponse>("/public/provinces", {
					params: { name, limit: 100 },
				})
				.then((r) => r.data),
	});
};

const useDistricts = (provinceId?: string, name?: string) => {
	return useQuery({
		queryKey: locationKeys.districts(provinceId, name),
		queryFn: () =>
			apiClient
				.get<DistrictListResponse>("/public/districts", {
					params: { province_id: provinceId, name, limit: 100 },
				})
				.then((r) => r.data),
		enabled: !!provinceId,
	});
};

const useWards = (districtId?: string, name?: string) => {
	return useQuery({
		queryKey: locationKeys.wards(districtId, name),
		queryFn: () =>
			apiClient
				.get<WardListResponse>("/public/wards", {
					params: { district_id: districtId, name, limit: 100 },
				})
				.then((r) => r.data),
		enabled: !!districtId,
	});
};

export { locationKeys, useDistricts, useProvinces, useWards };
