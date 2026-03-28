import StaticPageWrapper from "./static-page-wrapper";

const PaymentGuidePage = () => (
	<StaticPageWrapper title="Thông Tin Hướng Dẫn Thanh Toán">
		<section>
			<h2 className="mb-2 text-lg font-semibold">1. Chuyển khoản ngân hàng</h2>
			<p>
				Khi chuyển khoản, vui lòng ghi nội dung theo định dạng:{" "}
				<strong>[Mã đơn hàng]_[Số điện thoại]</strong>
			</p>
			<div className="mt-2 rounded border bg-gray-50 p-4">
				<p>
					<strong>Số tài khoản:</strong> XXXXXXXXXXX
				</p>
				<p>
					<strong>Chủ tài khoản:</strong> Nguyễn Công Tú
				</p>
				<p>
					<strong>Ngân hàng:</strong> XXXXXXXXXXXX
				</p>
			</div>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">
				2. Thanh toán khi nhận hàng (COD)
			</h2>
			<p>
				Quý khách thanh toán trực tiếp cho nhân viên giao hàng khi nhận được sản
				phẩm. Vui lòng kiểm tra sản phẩm trước khi thanh toán.
			</p>
		</section>
	</StaticPageWrapper>
);

export default PaymentGuidePage;
