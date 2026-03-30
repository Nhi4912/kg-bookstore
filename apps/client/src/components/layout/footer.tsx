import { Link } from "react-router-dom";

const SERVICES_LINKS = [
	{ label: "Liên Hệ", href: "/pages/lien-he" },
	{
		label: "Hướng Dẫn Thanh Toán",
		href: "/pages/thong-tin-huong-dan-thanh-toan",
	},
	{ label: "Chính Sách Đổi Trả", href: "/pages/chinh-sach-doi-tra" },
	{ label: "Chính Sách Bảo Mật", href: "/pages/chinh-sach-bao-mat" },
	{ label: "Điều Khoản Dịch Vụ", href: "/pages/dieu-khoan-dich-vu" },
	{ label: "Chính Sách Giao Hàng", href: "/pages/phuong-thuc-van-chuyen" },
];

const PRODUCT_LINKS = [
	{ label: "Sách Tiếng Việt", href: "/collection/sach-tieng-viet" },
	{ label: "Sách Giáo Khoa", href: "/collection/sach-giao-khoa" },
	{ label: "VPP & Dụng Cụ Học Sinh", href: "/collection/vpp-dung-cu-hoc-sinh" },
	{ label: "Đồ Dùng Học Sinh", href: "/collection/do-dung-hoc-sinh" },
	{ label: "Đồ Chơi", href: "/collection/do-choi" },
	{ label: "Quà Lưu Niệm", href: "/collection/qua-luu-niem" },
	{ label: "Bách Hóa Phẩm", href: "/collection/bach-hoa-pham" },
	{ label: "Thiết Bị Trường Học", href: "/collection/thiet-bi-truong-hoc" },
];

const Footer = () => (
	<footer className="bg-white border-t mt-12">
		<div className="mx-auto max-w-7xl px-4 py-10">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
				{/* Company */}
				<div>
					<h2 className="mb-4 text-lg font-bold">Nhà Sách Kiên Giang</h2>
					<ul className="space-y-2 text-sm text-gray-600">
						<li>
							Chào mừng bạn đến Nhà Sách Kiên Giang. nhasachkiengiang.com nhận
							đặt hàng trực tuyến và giao hàng tận nơi.
						</li>
						<li>
							Công Ty TNHH Hỗ Trợ &amp; Phát Triển Giáo dục Nhà Sách Kiên Giang.
						</li>
						<li>
							Giấy phép kinh doanh số: 1701662099 do Sở Kế Hoạch và Đầu Tư Tỉnh
							Kiên Giang cấp ngày 05/09/2018.
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h2 className="mb-4 text-lg font-bold">Thông tin liên hệ</h2>
					<ul className="space-y-2 text-sm text-gray-600">
						<li>
							<strong>Địa chỉ:</strong> 93-95-97, Đường 3 Tháng 2, Phường Vĩnh
							Bảo, TP. Rạch Giá, Kiên Giang
						</li>
						<li>
							<strong>Điện thoại:</strong> 02973.812.868 - 0919.681.768
						</li>
						<li>
							<strong>Email:</strong> nskg.hotro@gmail.com
						</li>
					</ul>
				</div>

				{/* Services */}
				<div>
					<h2 className="mb-4 text-lg font-bold">DỊCH VỤ - HỖ TRỢ</h2>
					<ul className="space-y-2 text-sm">
						{SERVICES_LINKS.map((link) => (
							<li key={link.href}>
								<Link
									to={link.href}
									className="text-gray-600 hover:text-[var(--color-brand-green-text)] transition-colors"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Products */}
				<div>
					<h2 className="mb-4 text-lg font-bold">SẢN PHẨM</h2>
					<ul className="space-y-2 text-sm">
						{PRODUCT_LINKS.map((link) => (
							<li key={link.href}>
								<Link
									to={link.href}
									className="text-gray-600 hover:text-[var(--color-brand-green-text)] transition-colors"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="mt-8 border-t pt-6 text-center text-xs text-gray-400">
				&copy; {new Date().getFullYear()} Nhà Sách Kiên Giang. All rights
				reserved.
			</div>
		</div>
	</footer>
);

export default Footer;
