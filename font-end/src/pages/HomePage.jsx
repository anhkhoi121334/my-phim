import React from "react";
import Banner from "../components/home/Banner";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FlashSale from "../components/home/FlashSale";
import Features from "../components/home/Features";
import NewArrivals from "../components/home/NewArrivals";
import Brands from "../components/home/Brands";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import CategoryOptionBar from "../components/CategoryOptionBar";
import { Link } from "react-router-dom";

// Thêm component cho banner app mobile
const AppDownload = () => (
  <section className="py-10 bg-slate-100">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:w-1/2 md:pr-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Trải nghiệm mua sắm tốt hơn với ứng dụng</h2>
          <p className="text-slate-600 mb-6">Tải ứng dụng để nhận thông báo về khuyến mãi và theo dõi đơn hàng dễ dàng hơn</p>
          <div className="flex space-x-4">
            <a href="#" className="block">
              <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/qrcode.png" alt="QR Code" className="h-32" />
            </a>
            <div className="flex flex-col justify-center space-y-2">
              <a href="#" className="block">
                <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png" alt="App Store" className="h-10" />
              </a>
              <a href="#" className="block">
                <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png" alt="Play Store" className="h-10" />
              </a>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src="https://salt.tikicdn.com/ts/upload/ae/72/a3/d2f7ac662d59b7ccd82c4aea07a143a7.png" alt="Mobile App" className="h-64 md:h-80" />
        </div>
      </div>
    </div>
  </section>
);

// Component cho "Hôm nay có gì hot"
const TodayDeals = () => (
  <section className="py-8 bg-white">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">HÔM NAY CÓ GÌ HOT?</h2>
        <Link to="/deals" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
          Xem tất cả
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { name: "Săn Sale Mỗi Ngày", icon: "🔥", bg: "bg-gradient-to-r from-orange-400 to-red-500", link: "/sale" },
          { name: "Mã Giảm Giá", icon: "🏷️", bg: "bg-gradient-to-r from-yellow-400 to-amber-500", link: "/vouchers" },
          { name: "Ưu Đãi Thanh Toán", icon: "💳", bg: "bg-gradient-to-r from-blue-400 to-sky-500", link: "/payment-deals" },
          { name: "Giao Siêu Tốc", icon: "🚚", bg: "bg-gradient-to-r from-emerald-400 to-green-500", link: "/fast-delivery" },
          { name: "Hàng Mới Về", icon: "✨", bg: "bg-gradient-to-r from-purple-400 to-violet-500", link: "/new-arrivals" },
          { name: "Dành Riêng Cho Bạn", icon: "🎁", bg: "bg-gradient-to-r from-rose-400 to-pink-500", link: "/personalized" }
        ].map((item, idx) => (
          <Link to={item.link} key={idx} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className={`${item.bg} px-4 py-6 text-center text-white flex flex-col items-center h-full`}>
              <span className="text-3xl mb-2">{item.icon}</span>
              <h3 className="font-medium text-sm">{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// Component cho gợi ý hôm nay
const Recommendations = () => (
  <section className="py-8 bg-white">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">GỢI Ý HÔM NAY</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition">
            <img 
              src={`https://picsum.photos/seed/${idx+10}/300/300`} 
              alt="Product" 
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="text-slate-800 text-sm line-clamp-2 mb-2">
                Sản phẩm công nghệ chất lượng cao #{idx+1}
              </h3>
              <div className="flex items-baseline">
                <span className="text-rose-600 font-bold">1.290.000₫</span>
                <span className="text-slate-500 text-xs line-through ml-2">1.790.000₫</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <>
      <Banner />
      <TodayDeals />
      <Categories />
      <FlashSale />
      <FeaturedProducts />
      <AppDownload />
      <Recommendations />
      <Features />
      <NewArrivals />
      <Brands />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default HomePage;
