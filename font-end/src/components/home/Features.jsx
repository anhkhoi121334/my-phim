import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faShieldAlt, faExchangeAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';

const features = [
  { icon: faShippingFast, color: "text-indigo-600", bg: "bg-indigo-100", title: "Giao hàng miễn phí", desc: "Miễn phí giao hàng toàn quốc cho tất cả đơn hàng trên 1 triệu đồng." },
  { icon: faShieldAlt, color: "text-rose-600", bg: "bg-rose-100", title: "Bảo hành chính hãng", desc: "Tất cả sản phẩm đều được bảo hành chính hãng từ 12 đến 24 tháng." },
  { icon: faExchangeAlt, color: "text-amber-600", bg: "bg-amber-100", title: "Đổi trả dễ dàng", desc: "Chính sách đổi trả linh hoạt trong vòng 30 ngày đầu tiên." },
  { icon: faHeadset, color: "text-emerald-600", bg: "bg-emerald-100", title: "Hỗ trợ 24/7", desc: "Đội ngũ tư vấn viên chuyên nghiệp, hỗ trợ 24/7 qua nhiều kênh." },
];

const Features = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">Tại sao chọn TechWorld?</h2>
        <p className="text-slate-600 text-base sm:text-lg">Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, idx) => (
          <div key={idx} className="feature-card rounded-xl p-6 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-center">
            <div className={`w-14 h-14 rounded-full ${f.bg} flex items-center justify-center mb-6`}>
              <FontAwesomeIcon icon={f.icon} className={`${f.color} text-xl feature-icon`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">{f.title}</h3>
            <p className="text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Features; 