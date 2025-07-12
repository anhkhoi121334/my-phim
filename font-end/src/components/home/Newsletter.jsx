import React from "react";

const Newsletter = () => (
  <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 animated-bg">
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Đăng ký nhận ưu đãi độc quyền</h2>
        <p className="text-indigo-100 text-base sm:text-lg mb-8">
          Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt
        </p>
        <form className="flex flex-col md:flex-row gap-4 justify-center">
          <input type="email" placeholder="Email của bạn"
            className="flex-1 py-3 px-6 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white" />
          <button type="submit"
            className="bg-white text-indigo-600 font-medium py-3 px-8 rounded-full hover:shadow-lg transition">
            Đăng ký
          </button>
        </form>
        <p className="text-indigo-200 text-sm mt-4">
          Chúng tôi cam kết bảo mật thông tin của bạn và không gửi email spam.
        </p>
      </div>
    </div>
  </section>
);

export default Newsletter; 