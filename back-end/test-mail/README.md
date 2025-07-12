# Test gửi mail với Node.js

## Hướng dẫn sử dụng

1. Cài đặt thư viện cần thiết:
   ```bash
   npm install nodemailer dotenv
   ```

2. Thêm các biến môi trường vào file `back-end/config.env`:
   ```env
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   MAIL_TO=receiver_email@example.com
   ```
   - `MAIL_USER`: Email dùng để gửi (nên dùng Gmail và tạo App Password nếu bật 2FA).
   - `MAIL_PASS`: App Password hoặc mật khẩu email.
   - `MAIL_TO`: Email nhận test.

3. Chạy script test gửi mail:
   ```bash
   node sendMailTest.js
   ```

Nếu gửi thành công sẽ hiện thông báo `Gửi mail thành công` trên terminal. 