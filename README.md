# 19.11 — Chuyên Hạ Long · V6.2 Light Celestial

Bản giao diện sáng, ưu tiên điện thoại.

## Điểm cập nhật V6.2
- Khu vực mở đầu chia hai cột trên màn hình lớn: video bên trái, lời mời khám phá vườn thư bên phải.
- Trên điện thoại, lời mời tự chuyển xuống ngay dưới video để dễ chạm.
- Khi video phát đến cuối, lời mời đổi nội dung để hướng người xem đi tiếp xuống khu vườn thư.
- Vườn thư bớt cảm giác danh sách đồng đều: trái tim được tạo hình đầy đặn bằng CSS, có nhịp nổi và bố cục so le tự nhiên.
- Giữ màu nền xanh `#D1E8FC`, chữ tối dễ đọc và ba màu nhận diện khối.
- Giữ nguyên dữ liệu 36 lớp và nội dung thư từ bản V6.1; không chỉnh sửa `data.js`.

## Chạy thử
Mở `index.html` bằng trình duyệt hiện đại. Video vẫn là vị trí chờ; khi có tệp video chính thức, cần gắn đường dẫn vào phần tử `#memoryPlayer` trước khi phát hành.

## Lưu ý
- Phản hồi cuối thư hiện là lựa chọn tương tác tại giao diện, chưa được gửi về máy chủ hay lưu thành báo cáo tổng hợp.
- Đã kiểm tra cú pháp JavaScript và tính toàn vẹn dữ liệu; cần kiểm thử thực tế trên điện thoại trước khi công bố.
