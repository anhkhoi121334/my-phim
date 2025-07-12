import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMicrochip, 
  faMapMarkerAlt, 
  faPhoneAlt, 
  faEnvelope, 
  faClock,
  faShield,
  faTruck,
  faMoneyBillWave,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faYoutube, 
  faLinkedin, 
  faTiktok 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Payment methods icons
  const paymentMethods = [
    { name: "Visa", image: "/images/payment/visa.svg" },
    { name: "Mastercard", image: "/images/payment/mastercard.svg" },
    { name: "PayPal", image: "/images/payment/paypal.svg" },
    { name: "MoMo", image: "/images/payment/momo.svg" }
  ];
  
  // Social media links
  const socialLinks = [
    { icon: faFacebookF, url: "#", color: "hover:bg-blue-600" },
    { icon: faTwitter, url: "#", color: "hover:bg-sky-500" },
    { icon: faInstagram, url: "#", color: "hover:bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700" },
    { icon: faYoutube, url: "#", color: "hover:bg-red-600" },
    { icon: faTiktok, url: "#", color: "hover:bg-black" }
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter section */}
        <div className="mb-12 bg-indigo-900/40 p-8 rounded-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-2">Nhận thông tin khuyến mãi</h3>
              <p className="text-slate-300">Đăng ký để nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full bg-white/10 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform rotate-12">
                <FontAwesomeIcon icon={faMicrochip} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">TechWorld</h3>
            </div>
            <p className="text-slate-400 text-sm mb-5">Nâng tầm trải nghiệm công nghệ với sản phẩm chính hãng, giá tốt và dịch vụ tận tâm.</p>
            
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-300">Kết nối với chúng tôi</h4>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  className={`w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 transition-colors duration-200 ${social.color}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.icon.iconName}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Sản phẩm</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/products?category=phone" className="hover:text-indigo-400 transition-colors duration-200">Điện thoại</Link></li>
              <li><Link to="/products?category=laptop" className="hover:text-indigo-400 transition-colors duration-200">Laptop</Link></li>
              <li><Link to="/products?category=tablet" className="hover:text-indigo-400 transition-colors duration-200">Tablet</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-indigo-400 transition-colors duration-200">Phụ kiện</Link></li>
              <li><Link to="/products?category=gaming" className="hover:text-indigo-400 transition-colors duration-200">Gaming</Link></li>
              <li><Link to="/products?category=smartwatch" className="hover:text-indigo-400 transition-colors duration-200">Đồng hồ thông minh</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Hỗ trợ</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/warranty" className="hover:text-indigo-400 transition-colors duration-200">Chính sách bảo hành</Link></li>
              <li><Link to="/return-policy" className="hover:text-indigo-400 transition-colors duration-200">Chính sách đổi trả</Link></li>
              <li><Link to="/shipping" className="hover:text-indigo-400 transition-colors duration-200">Giao hàng & thanh toán</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400 transition-colors duration-200">Câu hỏi thường gặp</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors duration-200">Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Liên hệ</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-400 mt-1" />
                <span>123 Đường Công Nghệ, Q.1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhoneAlt} className="text-indigo-400" />
                <span>Hotline: 0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400" />
                <a href="mailto:support@techworld.vn" className="hover:text-indigo-400 transition-colors duration-200">support@techworld.vn</a>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faClock} className="text-indigo-400" />
                <span>8:00 - 21:00, Thứ 2 - Chủ nhật</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-slate-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900/30 p-3 rounded-xl">
              <FontAwesomeIcon icon={faShield} className="text-indigo-400 text-2xl" />
            </div>
            <div>
              <h5 className="font-medium">Sản phẩm chính hãng</h5>
              <p className="text-slate-400 text-sm">Bảo hành toàn quốc</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900/30 p-3 rounded-xl">
              <FontAwesomeIcon icon={faTruck} className="text-indigo-400 text-2xl" />
            </div>
            <div>
              <h5 className="font-medium">Miễn phí vận chuyển</h5>
              <p className="text-slate-400 text-sm">Đơn hàng từ 500K</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900/30 p-3 rounded-xl">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-indigo-400 text-2xl" />
            </div>
            <div>
              <h5 className="font-medium">Thanh toán dễ dàng</h5>
              <p className="text-slate-400 text-sm">Nhiều phương thức</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900/30 p-3 rounded-xl">
              <FontAwesomeIcon icon={faHeadset} className="text-indigo-400 text-2xl" />
            </div>
            <div>
              <h5 className="font-medium">Hỗ trợ 24/7</h5>
              <p className="text-slate-400 text-sm">Tư vấn trực tuyến</p>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © {currentYear} TechWorld. Tất cả quyền được bảo lưu.
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">Chấp nhận thanh toán:</span>
            <div className="flex gap-2">
              {/* Placeholder for payment method icons */}
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium">VISA</span>
              </div>
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium">MC</span>
              </div>
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium">PP</span>
              </div>
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium">MoMo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
