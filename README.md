# Website Đăng ký Khám chữa bệnh

Website cho phép bệnh nhân tự đăng ký tài khoản và đặt lịch khám trực tuyến (chọn chuyên khoa, bác sĩ, ngày giờ còn trống), lễ tân/quản trị viên quản lý khoa/bác sĩ/lịch làm việc/lịch hẹn, và bác sĩ xem danh sách bệnh nhân đăng ký khám với mình theo ngày.

Toàn bộ hệ thống chạy bằng **Docker Compose** — không cần cài Node.js, PostgreSQL hay bất kỳ công cụ nào khác trên máy, chỉ cần Docker.

> Phạm vi chi tiết của dự án (những gì có/không có trong phiên bản này) được mô tả trong file `mô tả dự án.docx`, phần "PHẦN 3: PHẠM VI TRIỂN KHAI THỰC TẾ".

---

## 1. Yêu cầu hệ thống

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (bao gồm Docker Compose) — bản mới, hỗ trợ `docker compose` (không cần dấu gạch ngang).
- Không cần cài Node.js/PostgreSQL/npm trên máy, tất cả chạy trong container.

## 2. Chạy dự án

```bash
# 1. Vào thư mục gốc dự án
cd qldapm-project

# 2. Tạo file cấu hình môi trường từ mẫu (chỉ cần làm 1 lần)
cp .env.example .env

# 3. Build và khởi chạy toàn bộ hệ thống
docker compose up --build
```

Lần chạy đầu tiên sẽ hơi lâu (build image + tải PostgreSQL/Node/Nginx base image). Khi thấy log `Backend listening on port 3000` là hệ thống đã sẵn sàng.

Chạy ngầm (không giữ terminal): thêm `-d`

```bash
docker compose up --build -d
```

### Các địa chỉ truy cập

| Thành phần | Địa chỉ | Ghi chú |
|---|---|---|
| **Website** | http://localhost:8080 | Giao diện chính, dùng địa chỉ này |
| API (backend) | http://localhost:3000/api | Chỉ cần khi gọi API trực tiếp/debug |
| Adminer (xem CSDL) | http://localhost:8081 | Hệ thống: PostgreSQL, Server: `postgres`, User: `postgres`, Password: `postgres`, Database: `qldapm` |

Có thể đổi các cổng này trong file `.env` (biến `FRONTEND_PORT`, `BACKEND_PORT`, `ADMINER_PORT`, `POSTGRES_PORT`) nếu bị trùng cổng với ứng dụng khác trên máy.

### Dừng hệ thống

```bash
docker compose down
```

Dữ liệu (tài khoản, lịch hẹn...) được lưu trong Docker volume nên **vẫn còn** sau khi `docker compose down` và `up` lại. Nếu muốn xóa sạch dữ liệu và chạy lại từ đầu (seed lại dữ liệu mẫu):

```bash
docker compose down -v
docker compose up --build
```

---

## 3. Tài khoản có sẵn (seed sẵn khi chạy lần đầu)

| Vai trò | Email | Mật khẩu | Ghi chú |
|---|---|---|---|
| Quản trị viên (Admin) | `admin@clinic.local` | `Admin@123` | Toàn quyền quản lý |
| Bác sĩ | `bs.an@clinic.local` | `Doctor@123` | Khoa Nội tổng quát |
| Bác sĩ | `bs.binh@clinic.local` | `Doctor@123` | Khoa Nhi |
| Bác sĩ | `bs.chi@clinic.local` | `Doctor@123` | Khoa Tai Mũi Họng |

Hệ thống cũng tự tạo sẵn lịch làm việc mẫu cho 3 bác sĩ trong 7 ngày tới (sáng 07:30–11:30, chiều 13:30–17:00, mỗi khung giờ 30 phút) để có thể đặt lịch thử ngay.

Tài khoản **bệnh nhân** không có sẵn — vào trang **Đăng ký** để tự tạo tài khoản mới.

---

## 4. Hướng dẫn sử dụng theo vai trò

### 4.1. Bệnh nhân

1. Vào http://localhost:8080 → bấm **Đăng ký tài khoản** → điền thông tin → Đăng ký (tự động đăng nhập sau khi đăng ký thành công).
2. Vào **Đặt lịch khám** → chọn Chuyên khoa → chọn Bác sĩ → chọn Ngày → chọn khung giờ còn trống → nhập lý do khám (không bắt buộc) → **Xác nhận đặt lịch**.
3. Vào **Lịch hẹn của tôi** để xem các lịch đã đặt, có thể **Hủy** lịch hẹn đang ở trạng thái "Chờ xác nhận" hoặc "Đã xác nhận" (và chưa qua giờ khám).
4. Vào **Hồ sơ cá nhân** để cập nhật ngày sinh, giới tính, địa chỉ, số CCCD/CMND.

### 4.2. Quản trị viên (Admin)

Đăng nhập bằng tài khoản admin ở mục 3 → vào **Trang quản trị**:

- **Tổng quan**: số liệu nhanh (số khoa, số bác sĩ, lịch hẹn hôm nay, số lịch chờ xác nhận).
- **Chuyên khoa**: thêm/sửa/xóa danh mục khoa khám.
- **Bác sĩ**: thêm bác sĩ mới (hệ thống tự tạo tài khoản đăng nhập cho bác sĩ bằng email/mật khẩu bạn nhập), sửa thông tin, xóa (không xóa được nếu bác sĩ còn lịch hẹn sắp tới). Bấm **Lịch làm việc** trên từng bác sĩ để thêm ca làm việc (buổi sáng/chiều, giờ bắt đầu/kết thúc, thời lượng mỗi khung giờ, số bệnh nhân tối đa/khung giờ) — hệ thống tự sinh các khung giờ đặt lịch tương ứng.
- **Lịch hẹn**: xem toàn bộ lịch hẹn, lọc theo ngày/khoa/bác sĩ/trạng thái, **Xác nhận** hoặc **Hủy** lịch hẹn.
- **Bệnh nhân**: tìm kiếm theo tên/email/SĐT, xem hồ sơ chi tiết kèm lịch sử lịch hẹn của từng bệnh nhân.

### 4.3. Bác sĩ

Đăng nhập bằng một trong các tài khoản bác sĩ ở mục 3 → vào **Lịch khám của tôi**:

- Chọn ngày (mặc định là hôm nay) để xem danh sách bệnh nhân đã đăng ký khám với mình.
- Đánh dấu **Đã khám** hoặc **Không đến** cho từng lịch hẹn.

---

## 5. Cấu trúc thư mục

```
qldapm-project/
├── backend/                 NestJS API (TypeScript) + Prisma + PostgreSQL
│   ├── prisma/schema.prisma  Mô hình dữ liệu
│   ├── prisma/seed.ts        Dữ liệu mẫu (admin, khoa, bác sĩ, lịch làm việc)
│   └── src/                  Mã nguồn API (auth, departments, doctors, schedules, appointments, patients)
├── frontend/                 React + Vite + Ant Design
│   └── src/
│       ├── pages/             Các trang (trang chủ, đăng nhập/ký, đặt lịch, quản trị, bác sĩ...)
│       ├── layouts/           Khung giao diện chung
│       └── api/                Gọi API backend
├── docker-compose.yml        Định nghĩa 4 dịch vụ: postgres, backend, frontend, adminer
├── .env.example               Mẫu cấu hình môi trường
└── mô tả dự án.docx           Tài liệu mô tả dự án (đặc tả tham khảo + phạm vi triển khai thực tế)
```

## 6. Một số lệnh hữu ích

```bash
# Xem log của một dịch vụ (vd: backend)
docker compose logs -f backend

# Build lại 1 dịch vụ sau khi sửa code rồi khởi động lại
docker compose up --build -d backend
docker compose up --build -d frontend

# Chạy test tự động của backend (unit test chống đặt trùng khung giờ)
docker compose exec backend npm test

# Vào shell bên trong container backend để debug
docker compose exec backend sh

# Xem danh sách container đang chạy
docker compose ps
```

## 7. Xử lý sự cố thường gặp

- **Báo lỗi cổng đã được sử dụng (port already in use)**: đổi số cổng tương ứng trong file `.env` (ví dụ `FRONTEND_PORT=8090`) rồi chạy lại `docker compose up -d`.
- **Sửa code backend/frontend nhưng không thấy thay đổi**: cần build lại image, không chỉ khởi động lại container — dùng `docker compose up --build -d <tên dịch vụ>`.
- **Muốn làm lại từ đầu với dữ liệu sạch**: `docker compose down -v` rồi `docker compose up --build`.
- **Quên mật khẩu admin**: mở Adminer (http://localhost:8081) để xem/sửa trực tiếp trong bảng `users`, hoặc xóa volume và chạy lại để được cấp lại tài khoản mẫu ở mục 3.
