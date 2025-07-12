const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../config.env' });

// Cấu hình transporter với thông tin từ biến môi trường
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
  secure: false, // true cho 465, false cho các port khác
  auth: {
    user: process.env.MAIL_USER, // Email gửi
    pass: process.env.MAIL_PASS, // Mật khẩu ứng dụng
  },
});

// Hàm gửi mail test
async function sendTestMail() {
  try {
    const info = await transporter.sendMail({
      from: `"Test Mail" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || 'yourtestmail@example.com', // Địa chỉ nhận test
      subject: 'Test gửi mail từ Node.js',
      text: 'Đây là email test gửi từ Node.js bằng Nodemailer!',
      html: '<b>Đây là email test gửi từ Node.js bằng Nodemailer!</b>',
    });
    console.log('Gửi mail thành công:', info.messageId);
  } catch (error) {
    console.error('Lỗi gửi mail:', error);
  }
}

sendTestMail(); 