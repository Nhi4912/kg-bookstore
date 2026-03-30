import type {
	DistrictListResponse,
	ProvinceListResponse,
	WardListResponse,
} from "@kgbookstore/api-contract";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
			api.get<ProvinceListResponse>("/public/provinces", {
				name,
				limit: 100,
			}),
	});
};

const useDistricts = (provinceId?: string, name?: string) => {
	return useQuery({
		queryKey: locationKeys.districts(provinceId, name),
		queryFn: () =>
			api.get<DistrictListResponse>("/public/districts", {
				province_id: provinceId,
				name,
				limit: 100,
			}),
		enabled: !!provinceId,
	});
};

const useWards = (districtId?: string, name?: string) => {
	return useQuery({
		queryKey: locationKeys.wards(districtId, name),
		queryFn: () =>
			api.get<WardListResponse>("/public/wards", {
				district_id: districtId,
				name,
				limit: 100,
			}),
		enabled: !!districtId,
	});
};

export { locationKeys, useDistricts, useProvinces, useWards };
