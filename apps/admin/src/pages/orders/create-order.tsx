import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateOrderRequest } from "@kgbookstore/api-contract";
import { createOrderRequestSchema } from "@kgbookstore/api-contract";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InputHF, SelectHF } from "@/components/shared/form-fields";
import PageWrapper from "@/components/shared/page-wrapper";
import PaperSection from "@/components/shared/paper-section";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { PAYMENT_METHOD_LABELS } from "@/constants/order";
import { useCreateOrder } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/format";
import type { OrderItemData } from "./create-order-item-row";
import CreateOrderItemRow from "./create-order-item-row";

const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
	([value, label]) => ({
		value,
		label,
	}),
);

const CreateOrderPage = () => {
	const navigate = useNavigate();
	const createOrder = useCreateOrder();
	const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);

	const form = useForm<CreateOrderRequest>({
		resolver: zodResolver(createOrderRequestSchema),
		defaultValues: {
			customer: {
				first_name: "",
				last_name: "",
				phone_number: "",
				address: "",
			},
			payment_method: "CASH_ON_DELIVERY",
			order_items: [],
			bill_items: [],
			note: "",
		},
	});

	const subtotal = orderItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	const handleAddMockItem = () => {
		const mockItem: OrderItemData = {
			variant_id: `mock-variant-${Date.now()}`,
			product_name: `Sản phẩm mẫu ${orderItems.length + 1}`,
			variant_label: "Mặc định",
			quantity: 1,
			price: 150000,
		};
		setOrderItems((prev) => [...prev, mockItem]);
	};

	const handleRemoveItem = (variantId: string) => {
		setOrderItems((prev) =>
			prev.filter((item) => item.variant_id !== variantId),
		);
	};

	const handleQuantityChange = (variantId: string, quantity: number) => {
		if (quantity < 1) return;
		setOrderItems((prev) =>
			prev.map((item) =>
				item.variant_id === variantId ? { ...item, quantity } : item,
			),
		);
	};

	const handleSubmit = form.handleSubmit(async (data) => {
		if (orderItems.length === 0) {
			toast.error("Đơn hàng cần ít nhất 1 sản phẩm");
			return;
		}

		const requestData: CreateOrderRequest = {
			...data,
			order_items: orderItems.map((item) => ({
				variant_id: item.variant_id,
				quantity: item.quantity,
			})),
			bill_items: orderItems.map((item) => ({
				variant_id: item.variant_id,
				type: "PRODUCT_BILL" as const,
				final_price: item.price * item.quantity,
			})),
		};

		try {
			await createOrder.mutateAsync(requestData);
			toast.success("Tạo đơn hàng thành công");
			navigate(ROUTES.ORDERS);
		} catch {
			toast.error("Tạo đơn hàng thất bại");
		}
	});

	return (
		<PageWrapper title="Tạo đơn hàng">
			<FormProvider {...form}>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Left column: Customer + order summary */}
						<div className="space-y-6">
							<PaperSection title="Chi tiết khách hàng">
								<div className="space-y-4">
									<InputHF name="customer.last_name" label="Họ" />
									<InputHF name="customer.first_name" label="Tên" />
									<InputHF name="customer.phone_number" label="Số điện thoại" />
									<InputHF name="customer.address" label="Địa chỉ" />
								</div>
							</PaperSection>

							<PaperSection title="Chi tiết đơn hàng">
								<div className="space-y-3 text-sm">
									<SelectHF
										name="payment_method"
										label="Loại thanh toán"
										options={PAYMENT_METHOD_OPTIONS}
									/>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Số lượng sản phẩm
										</span>
										<span>{orderItems.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Tạm tính</span>
										<span>{formatCurrency(subtotal)}</span>
									</div>
									<InputHF name="note" label="Ghi chú" />
									<div className="flex justify-between border-t pt-2 font-semibold">
										<span>Tổng</span>
										<span>{formatCurrency(subtotal)}</span>
									</div>
								</div>
							</PaperSection>
						</div>

						{/* Right column: Products */}
						<div className="lg:col-span-2">
							<PaperSection title="Sản phẩm">
								<div className="space-y-4">
									<Button
										type="button"
										variant="outline"
										onClick={handleAddMockItem}
									>
										Thêm sản phẩm
									</Button>

									{orderItems.length === 0 ? (
										<p className="py-4 text-center text-sm text-muted-foreground">
											Chưa có sản phẩm nào
										</p>
									) : (
										<div className="space-y-2">
											{orderItems.map((item) => (
												<CreateOrderItemRow
													key={item.variant_id}
													item={item}
													onQuantityChange={handleQuantityChange}
													onRemove={handleRemoveItem}
												/>
											))}
										</div>
									)}
								</div>
							</PaperSection>
						</div>
					</div>

					<div className="mt-6 flex justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate(ROUTES.ORDERS)}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={createOrder.isPending}>
							{createOrder.isPending ? "Đang tạo..." : "Tạo đơn hàng"}
						</Button>
					</div>
				</form>
			</FormProvider>
		</PageWrapper>
	);
};

export default CreateOrderPage;
