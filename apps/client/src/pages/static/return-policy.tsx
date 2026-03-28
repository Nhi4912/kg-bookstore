import StaticPageWrapper from "./static-page-wrapper";

const ReturnPolicyPage = () => (
	<StaticPageWrapper title="Chính Sách Đổi Trả Hàng">
		<section>
			<h2 className="mb-2 text-lg font-semibold">
				1. Đối với khách hàng mua online
			</h2>
			<p>Quy trình đổi trả gồm 3 bước:</p>
			<ol className="list-decimal space-y-1 pl-5">
				<li>
					Liên hệ hotline <strong>02973 812 868</strong> hoặc gửi email yêu cầu
					đổi trả
				</li>
				<li>Gửi lại sản phẩm về địa chỉ của Nhà Sách Kiên Giang</li>
				<li>Nhận sản phẩm thay thế hoặc hoàn tiền</li>
			</ol>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">
				2. Đối với khách hàng mua tại cửa hàng
			</h2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Thời gian đổi trả: trong vòng 7 ngày kể từ ngày mua</li>
				<li>Sản phẩm phải còn nguyên tem, nhãn mác và hóa đơn mua hàng</li>
				<li>Sản phẩm chưa qua sử dụng, còn nguyên trạng</li>
			</ul>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">
				3. Các trường hợp được đổi trả
			</h2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Sản phẩm bị giao sai</li>
				<li>Sản phẩm không đúng như mô tả</li>
				<li>Sản phẩm hết hàng không thể giao</li>
				<li>Sản phẩm bị lỗi in ấn, rách, hỏng do nhà sản xuất</li>
			</ul>
		</section>
	</StaticPageWrapper>
);

export default ReturnPolicyPage;
