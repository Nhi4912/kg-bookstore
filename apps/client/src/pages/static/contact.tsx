import StaticPageWrapper from "./static-page-wrapper";

const ContactPage = () => (
	<StaticPageWrapper title="Liên Hệ">
		<section>
			<h2 className="mb-2 text-lg font-semibold">Về Nhà Sách Kiên Giang</h2>
			<p>
				Nhà Sách Kiên Giang được thành lập với mong muốn mang đến cho bạn đọc
				những cuốn sách hay, dụng cụ học tập chất lượng cùng dịch vụ tận tâm
				nhất. Với đội ngũ gần 2.200 nhân viên, chúng tôi luôn nỗ lực cung cấp đa
				dạng sản phẩm từ sách giáo khoa, văn phòng phẩm đến đồ chơi giáo dục.
			</p>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">Thông tin liên hệ</h2>
			<ul className="space-y-2">
				<li>
					<strong>Công ty:</strong> Công Ty TNHH Hỗ Trợ &amp; Phát Triển Giáo
					Dục Nhà Sách Kiên Giang
				</li>
				<li>
					<strong>Địa chỉ:</strong> 93-95-97, Đường 3 Tháng 2, Phường Vĩnh Bảo,
					TP. Rạch Giá, Kiên Giang
				</li>
				<li>
					<strong>Điện thoại:</strong> 02973.812.868 - 0919.681.768
				</li>
				<li>
					<strong>Email:</strong> nskg.hotro@gmail.com
				</li>
			</ul>
		</section>

		<section>
			<h2 className="mb-2 text-lg font-semibold">Sứ mệnh</h2>
			<p>
				Nhà Sách Kiên Giang cam kết mang đến cho khách hàng những sản phẩm chất
				lượng cao với giá cả hợp lý, góp phần phát triển văn hoá đọc và giáo dục
				tại Việt Nam.
			</p>
		</section>
	</StaticPageWrapper>
);

export default ContactPage;
