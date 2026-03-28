import StaticPageWrapper from "./static-page-wrapper";

const DeliveryPolicyPage = () => (
	<StaticPageWrapper title="Chính Sách Giao Hàng & Kiểm Hàng">
		<section>
			<h2 className="mb-2 text-lg font-semibold">1. Chính sách giao hàng</h2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Giao hàng toàn quốc qua các đơn vị vận chuyển uy tín</li>
				<li>Thời gian xử lý đơn hàng: 1-2 ngày làm việc</li>
				<li>Thời gian giao hàng: 2-5 ngày tuỳ khu vực</li>
			</ul>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">2. Lưu ý khi nhận hàng</h2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Nhân viên giao hàng sẽ liên hệ trước 3-5 phút</li>
				<li>Tối đa 3 lần liên hệ, nếu không được sẽ hoàn đơn</li>
				<li>Kiểm tra sản phẩm trước khi ký nhận</li>
			</ul>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">3. Huỷ đơn & hoàn tiền</h2>
			<p>
				Trường hợp đơn hàng bị huỷ hoặc sản phẩm bị hư hỏng trong quá trình vận
				chuyển, Nhà Sách Kiên Giang sẽ hoàn tiền trong vòng 5-7 ngày làm việc.
			</p>
			<p className="mt-2">
				Hotline hỗ trợ: <strong>1900636467</strong>
				<br />
				Email: <strong>cskh@nhasachkiengiang.com.vn</strong>
			</p>
		</section>
	</StaticPageWrapper>
);

export default DeliveryPolicyPage;
