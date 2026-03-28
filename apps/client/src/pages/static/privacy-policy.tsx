import StaticPageWrapper from "./static-page-wrapper";

const PrivacyPolicyPage = () => (
	<StaticPageWrapper title="Chính Sách Bảo Mật">
		<section>
			<h2 className="mb-2 text-lg font-semibold">
				1. Mục đích và phạm vi thu thập thông tin
			</h2>
			<p>
				Nhà Sách Kiên Giang thu thập thông tin cá nhân khi khách hàng đăng ký
				tài khoản, mua hàng hoặc sử dụng dịch vụ. Thông tin bao gồm: Họ tên, địa
				chỉ email, số điện thoại, địa chỉ giao hàng.
			</p>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">
				2. Phạm vi sử dụng thông tin
			</h2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Gửi bản tin, thông tin khuyến mãi đến khách hàng</li>
				<li>Hỗ trợ dịch vụ chăm sóc khách hàng</li>
				<li>Giải quyết tranh chấp, khiếu nại</li>
				<li>Liên lạc xác nhận đơn hàng và giao hàng</li>
			</ul>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">3. Chia sẻ thông tin</h2>
			<p>
				Nhà Sách Kiên Giang cam kết không chia sẻ thông tin cá nhân của khách
				hàng cho bất kỳ bên thứ ba nào, trừ trường hợp có yêu cầu từ cơ quan
				pháp luật hoặc khi cần bảo vệ quyền lợi của công ty.
			</p>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">4. Cam kết bảo mật</h2>
			<p>
				Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của
				khách hàng. Thông tin thanh toán được bảo mật tuyệt đối và không được
				lưu trữ trên hệ thống.
			</p>
		</section>
	</StaticPageWrapper>
);

export default PrivacyPolicyPage;
