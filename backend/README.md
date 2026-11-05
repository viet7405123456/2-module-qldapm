# Backend — Website đăng ký khám chữa bệnh

NestJS + Prisma + PostgreSQL + JWT. Toàn bộ API nằm dưới tiền tố `/api`.

## Chạy

Luôn chạy qua Docker (xem `docker-compose.yml` ở thư mục gốc). Không cần Node/npm trên máy host.

## Database & migrations

- Migration khởi tạo (`prisma/migrations/20261105080932_init`) được sinh bằng `prisma migrate dev` chạy
  trong container tạm trỏ vào một Postgres tạm, rồi copy migration SQL vào repo — không hand-write SQL,
  tránh lệch schema so với `prisma/schema.prisma`.
- Lúc container khởi động, `docker-entrypoint.sh` chạy `prisma migrate deploy` (retry nếu DB chưa sẵn sàng),
  sau đó seed dữ liệu mẫu, rồi mới start app.

## Seed script và vấn đề ts-node trên Node 20

`prisma/seed.ts` dùng cú pháp `import` (ESM). Trên Node 20, nếu gọi trực tiếp
`ts-node prisma/seed.ts` (hoặc `node -r ts-node/register prisma/seed.ts`) làm **entry point**, Node tự phát
hiện cú pháp ESM trong file `.ts` và nạp qua ESM loader *trước khi* ts-node có cơ hội đăng ký hook
CommonJS của nó — dẫn tới lỗi `ERR_UNKNOWN_FILE_EXTENSION` cho `.ts`. Cách khắc phục: dùng một entry point
`.js` CommonJS nhỏ (`prisma/run-seed.js`) gọi `require('ts-node/register'); require('./seed.ts');` — khi đó
`seed.ts` được nạp qua `require()` lồng bên trong pipeline CommonJS (nơi hook của ts-node hoạt động đúng),
không phải qua detect-module của Node khi nạp entry script. Container chạy `node prisma/run-seed.js`.

## Test

Dockerfile tự chạy `npm test` trong build stage (unit test cho logic giữ slot chống double-booking ở
`src/appointments/appointments.service.spec.ts`, mock Prisma transaction để mô phỏng khóa hàng tuần tự).
