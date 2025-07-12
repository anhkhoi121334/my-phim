import React from 'react';

const ContactPage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-indigo-600 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Liên Hệ Với TechWorld</h1>
            <p className="text-lg text-indigo-100 mb-8">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Card 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-phone-alt text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hotline</h3>
              <p className="text-gray-600 mb-4">Gọi cho chúng tôi từ 8:00 - 21:00, T2 - CN</p>
              <a href="tel:18001234" className="text-indigo-600 font-bold text-lg hover:text-indigo-800 transition">1800 1234</a>
            </div>

            {/* Contact Card 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-envelope text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Gửi email cho chúng tôi, phản hồi trong vòng 24h</p>
              <a href="mailto:info@techworld.vn" className="text-indigo-600 font-bold text-lg hover:text-indigo-800 transition">info@techworld.vn</a>
            </div>

            {/* Contact Card 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-map-marker-alt text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Địa chỉ</h3>
              <p className="text-gray-600 mb-4">Văn phòng chính của TechWorld</p>
              <p className="text-indigo-600 font-bold">123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert('Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!');
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input type="text" id="fullname" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                    <select id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="" disabled selected>Chọn chủ đề</option>
                      <option value="product">Thông tin sản phẩm</option>
                      <option value="order">Đơn hàng</option>
                      <option value="warranty">Bảo hành</option>
                      <option value="feedback">Góp ý</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung tin nhắn</label>
                    <textarea id="message" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition">
                    Gửi tin nhắn
                  </button>
                </form>
              </div>

              {/* Map and Info */}
              <div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
                  <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0389955271654!2d106.70315931480084!3d10.7308678923315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f6916da2781%3A0x2472c84c005389b6!2zMTIzIE5ndXnhu4VuIFbEg24gTGluaCwgVMOibiBQaG9uZywgUXXhuq1uIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1617169122498!5m2!1svi!2s"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allowFullScreen loading="lazy"
                      title="TechWorld location">
                    </iframe>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Giờ làm việc</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Thứ Hai - Thứ Bảy</span>
                      <span className="font-medium">8:00 - 21:00</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Chủ Nhật</span>
                      <span className="font-medium">9:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Ngày lễ</span>
                      <span className="font-medium">10:00 - 18:00</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Kết nối với chúng tôi</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition">
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Locations */}
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Hệ Thống Cửa Hàng</h2>
              <p className="text-gray-600">Tìm cửa hàng TechWorld gần nhất với bạn</p>
            </div>

            {/* Region Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">Tất cả</button>
              <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">Hà Nội</button>
              <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">TP. HCM</button>
              <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">Đà Nẵng</button>
              <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">Cần Thơ</button>
              <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">Các tỉnh khác</button>
            </div>

            {/* Store Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store entries */}
              {[
                {
                  name: "TechWorld Quận 7",
                  address: "123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. HCM",
                  phone: "028 1234 5678"
                },
                {
                  name: "TechWorld Quận 1",
                  address: "456 Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM",
                  phone: "028 9876 5432"
                },
                {
                  name: "TechWorld Cầu Giấy",
                  address: "789 Xuân Thủy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
                  phone: "024 1234 5678"
                },
                {
                  name: "TechWorld Đà Nẵng",
                  address: "101 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng",
                  phone: "0236 1234 567"
                }
              ].map((store, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-gray-600 mb-3">{store.address}</p>
                    <div className="flex items-center mb-3">
                      <span className="flex items-center text-sm text-gray-500 mr-4">
                        <i className="fas fa-phone-alt text-indigo-600 mr-2"></i> {store.phone}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <i className="far fa-clock text-indigo-600 mr-2"></i> 8:00 - 21:00
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" 
                        className="flex-1 bg-indigo-100 text-indigo-600 font-medium py-2 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition">
                        <i className="fas fa-map-marker-alt mr-2"></i> Chỉ đường
                      </a>
                      <a href={`tel:${store.phone.replace(/\s/g, '')}`} 
                        className="flex-1 bg-indigo-600 text-white font-medium py-2 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition">
                        <i className="fas fa-phone-alt mr-2"></i> Gọi ngay
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a href="#" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition">
                Xem tất cả cửa hàng
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Câu Hỏi Thường Gặp</h2>
              <p className="text-gray-600">Một số câu hỏi phổ biến về việc liên hệ và tìm kiếm thông tin</p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {[
                {
                  question: "Làm thế nào để đặt lịch hẹn tại cửa hàng?",
                  answer: "Bạn có thể đặt lịch hẹn tại cửa hàng TechWorld bằng cách gọi đến hotline 1800 1234, hoặc điền vào form liên hệ trên trang web của chúng tôi. Ngoài ra, bạn cũng có thể trực tiếp đến cửa hàng gần nhất để được tư vấn và hỗ trợ."
                },
                {
                  question: "Tôi muốn góp ý về dịch vụ, liên hệ như thế nào?",
                  answer: "Chúng tôi luôn đánh giá cao mọi góp ý từ khách hàng. Bạn có thể gửi góp ý qua email info@techworld.vn, gọi đến hotline 1800 1234, hoặc điền vào form góp ý trên trang web của chúng tôi. Mọi góp ý sẽ được xem xét và phản hồi trong thời gian sớm nhất."
                },
                {
                  question: "TechWorld có cung cấp dịch vụ kỹ thuật tại nhà không?",
                  answer: "Có, TechWorld cung cấp dịch vụ kỹ thuật tại nhà cho các sản phẩm có kích thước lớn hoặc khó di chuyển. Để đặt lịch hẹn dịch vụ tại nhà, vui lòng gọi đến hotline 1800 1234 hoặc đặt lịch trực tuyến trên trang web của chúng tôi. Kỹ thuật viên sẽ liên hệ với bạn để xác nhận thời gian cụ thể."
                },
                {
                  question: "Làm thế nào để trở thành đối tác của TechWorld?",
                  answer: "Chúng tôi luôn tìm kiếm cơ hội hợp tác với các đối tác tiềm năng. Nếu bạn muốn trở thành đối tác của TechWorld, vui lòng gửi thông tin chi tiết về công ty và đề xuất hợp tác của bạn đến email partnerships@techworld.vn. Đội ngũ phát triển kinh doanh của chúng tôi sẽ xem xét và liên hệ lại với bạn trong vòng 7 ngày làm việc."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <button 
                    className="flex justify-between items-center w-full p-5 text-left"
                    onClick={(e) => {
                      const content = e.currentTarget.nextElementSibling;
                      const icon = e.currentTarget.querySelector('i');
                      if (content.style.display === 'none' || content.style.display === '') {
                        content.style.display = 'block';
                        icon.style.transform = 'rotate(180deg)';
                      } else {
                        content.style.display = 'none';
                        icon.style.transform = 'rotate(0deg)';
                      }
                    }}>
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <i className="fas fa-chevron-down text-indigo-600"></i>
                  </button>
                  <div className="p-5 border-t border-gray-100" style={{display: 'none'}}>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        id="backToTop"
        className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition opacity-0 invisible"
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        style={{
          opacity: 0,
          visibility: 'hidden'
        }}
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </>
  );
};

export default ContactPage; 