import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_RECENT_PRODUCTS, RECENT_PRODUCTS_KEY } from "@/constants";

interface RecentState {
	productIds: string[];
	addProductId: (id: string) => void;
	getFilteredIds: (excludeId: string) => string[];
}

export const useRecentStore = create<RecentState>()(
	persist(
		(set, get) => ({
			productIds: [],

			addProductId: (id) =>
				set((state) => {
					const filtered = state.productIds.filter((pid) => pid !== id);
					return {
						productIds: [id, ...filtered].slice(0, MAX_RECENT_PRODUCTS),
					};
				}),

			getFilteredIds: (excludeId) =>
				get().productIds.filter((pid) => pid !== excludeId),
		}),
		{ name: RECENT_PRODUCTS_KEY },
	),
);
