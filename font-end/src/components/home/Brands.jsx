import React from "react";
const Brands = () => (
  <section className="py-16 bg-white text-center">
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">Thương hiệu nổi tiếng</h2>
      <p className="text-slate-600 text-base sm:text-lg mb-12">Chúng tôi là đối tác chính thức của các thương hiệu công nghệ hàng đầu thế giới</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex items-center justify-center">
            <img src={`https://via.placeholder.com/150x60?text=Brand+${i}`} alt="Brand" className="h-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Brands; 