export const MOCK_TAGS = [
	{
		tag_id: "t1",
		tag_name: "Sách Bán Chạy",
		collection_ids: ["sach-tieng-viet", "sach-giao-khoa"],
	},
	{
		tag_id: "t2",
		tag_name: "Sách Mới Phát Hành",
		collection_ids: ["sach-tieng-viet", "vpp-dung-cu-hoc-sinh"],
	},
	{
		tag_id: "t3",
		tag_name: "Khuyến Mãi Đặc Biệt",
		collection_ids: ["do-choi", "bach-hoa-pham", "qua-luu-niem"],
	},
	{
		tag_id: "t4",
		tag_name: "Dành Cho Học Sinh",
		collection_ids: [
			"sach-giao-khoa",
			"vpp-dung-cu-hoc-sinh",
			"do-dung-hoc-sinh",
		],
	},
];

export const MOCK_SPECIAL_TAG = {
	tag_id: "t-special",
	tag_name: "Danh Mục Nổi Bật",
	collections: [
		{ collection_id: "sach-tieng-viet", collection_name: "Sách Tiếng Việt" },
		{ collection_id: "sach-giao-khoa", collection_name: "Sách Giáo Khoa" },
		{
			collection_id: "vpp-dung-cu-hoc-sinh",
			collection_name: "VPP & Dụng Cụ Học Sinh",
		},
		{ collection_id: "do-choi", collection_name: "Đồ Chơi" },
		{ collection_id: "qua-luu-niem", collection_name: "Quà Lưu Niệm" },
	],
};
