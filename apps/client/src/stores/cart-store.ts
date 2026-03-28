import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CART_STORAGE_KEY } from "@/constants";

export interface CartItem {
	id: string;
	name: string;
	productName: string;
	productId: string;
	qty: number;
	price: number;
	imgUrl?: string;
}

interface CartState {
	items: CartItem[];
	isOpen: boolean;
	addItem: (item: CartItem) => void;
	updateQuantity: (id: string, qty: number) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
	toggleCart: () => void;
	setCartOpen: (open: boolean) => void;
	totalPrice: () => number;
	totalItems: () => number;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],
			isOpen: false,

			addItem: (item) =>
				set((state) => {
					const existing = state.items.find((i) => i.id === item.id);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.id === item.id ? { ...i, qty: i.qty + item.qty } : i,
							),
						};
					}
					return { items: [...state.items, item] };
				}),

			updateQuantity: (id, qty) =>
				set((state) => {
					if (qty < 1) {
						return { items: state.items.filter((i) => i.id !== id) };
					}
					return {
						items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
					};
				}),

			removeItem: (id) =>
				set((state) => ({
					items: state.items.filter((i) => i.id !== id),
				})),

			clearCart: () => set({ items: [] }),
			toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
			setCartOpen: (open) => set({ isOpen: open }),

			totalPrice: () =>
				get().items.reduce((sum, item) => sum + item.price * item.qty, 0),

			totalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0),
		}),
		{ name: CART_STORAGE_KEY },
	),
);
