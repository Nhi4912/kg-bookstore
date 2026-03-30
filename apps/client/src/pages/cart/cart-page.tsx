import { useState } from "react";
import { Link } from "react-router-dom";
import { useCanonicalUrl, useDocumentTitle } from "@/hooks/use-document-title";
import { useCartStore } from "@/stores/cart-store";
import CartItemCard from "./cart-item-card";
import CheckoutForm from "./checkout-form";
import CheckoutSuccess from "./checkout-success";

const CartPage = () => {
	const items = useCartStore((s) => s.items);
	const totalPrice = useCartStore((s) =>
		s.items.reduce((sum, item) => sum + item.price * item.qty, 0),
	);
	const clearCart = useCartStore((s) => s.clearCart);
	const [showSuccess, setShowSuccess] = useState(false);

	useDocumentTitle("Giỏ hàng");
	useCanonicalUrl("/cart");

	if (showSuccess) {
		return <CheckoutSuccess />;
	}

	if (items.length === 0) {
		return (
			<div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
				<p className="mb-4 text-gray-500 dark:text-gray-400">Giỏ hàng trống</p>
				<Link
					to="/"
					className="rounded-md bg-[var(--color-brand-green)] px-6 py-2.5 text-sm font-medium text-white"
				>
					Tiếp tục mua sắm
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Cart items */}
				<div className="space-y-4 lg:col-span-8">
					{items.map((item) => (
						<CartItemCard key={item.id} item={item} />
					))}
				</div>

				{/* Checkout form */}
				<div className="lg:col-span-4">
					<CheckoutForm
						items={items}
						totalPrice={totalPrice}
						onSuccess={() => {
							clearCart();
							setShowSuccess(true);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
