import StaticPageWrapper from "./static-page-wrapper";

const TermsOfServicePage = () => (
	<StaticPageWrapper title="Điều Khoản Dịch Vụ">
		<section>
			<h2 className="mb-2 text-lg font-semibold">1. Giới thiệu</h2>
			<p>
				Khi truy cập vào website nhasachkiengiang.com, bạn đồng ý chấp nhận các
				điều khoản dịch vụ được quy định dưới đây. Nhà Sách Kiên Giang có quyền
				thay đổi, chỉnh sửa các điều khoản này mà không cần thông báo trước.
			</p>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">
				2. Hướng dẫn sử dụng website
			</h2>
			<ul className="list-disc space-y-1 pl-5">
				<li>
					Khách hàng phải từ 18 tuổi trở lên hoặc có sự giám sát của phụ huynh
				</li>
				<li>Đảm bảo năng lực pháp lý khi thực hiện giao dịch</li>
				<li>Không sử dụng website cho các mục đích bất hợp pháp</li>
			</ul>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">
				3. Thanh toán an toàn và tiện lợi
			</h2>
			<p>Nhà Sách Kiên Giang hỗ trợ 3 hình thức thanh toán:</p>
			<ul className="list-disc space-y-1 pl-5">
				<li>Thanh toán trực tiếp tại cửa hàng</li>
				<li>Thanh toán khi nhận hàng (COD)</li>
				<li>Chuyển khoản ngân hàng</li>
			</ul>
		</section>
	</StaticPageWrapper>
);

export default TermsOfServicePage;
