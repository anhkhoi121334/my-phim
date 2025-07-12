import React from "react";

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Khách hàng thân thiết",
    comment: "Dịch vụ chăm sóc khách hàng tuyệt vời, nhân viên tư vấn rất tận tình. Sản phẩm chất lượng đúng như mô tả, giao hàng nhanh chóng. Chắc chắn sẽ quay lại!",
    avatar: "https://via.placeholder.com/100x100"
  },
  {
    name: "Trần Thị B",
    role: "Designer",
    comment: "Tôi đã mua laptop ở đây và rất hài lòng với chất lượng sản phẩm. Giá cả hợp lý, nhiều ưu đãi và chế độ bảo hành tốt. Sẽ giới thiệu cho bạn bè!",
    avatar: "https://via.placeholder.com/100x100"
  },
  {
    name: "Lê Văn C",
    role: "Kỹ sư phần mềm",
    comment: "Mua điện thoại ở TechWorld là quyết định đúng đắn. Sản phẩm chính hãng, kích hoạt bảo hành đầy đủ và được tặng kèm nhiều phụ kiện có giá trị.",
    avatar: "https://via.placeholder.com/100x100"
  }
];

const Testimonials = () => (
  <section className="py-16 bg-slate-50">
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
        <p className="text-slate-600 text-base sm:text-lg">Trải nghiệm của hàng ngàn khách hàng đã mua sắm tại TechWorld</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div key={idx} className="review-card bg-white p-6 rounded-xl shadow-sm">
            <div className="flex text-amber-400 mb-4">
              {[1,2,3,4,5].map(i => (
                <i key={i} className={`fas fa-star${i === 5 && idx === 1 ? '-half-alt' : ''}`}></i>
              ))}
            </div>
            <p className="text-slate-600 mb-6 italic">"{t.comment}"</p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-slate-800">{t.name}</h4>
                <p className="text-slate-500 text-sm">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials; 