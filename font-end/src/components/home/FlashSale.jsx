import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FlashSale = () => {
  // State cho đồng hồ đếm ngược
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  // Cập nhật đồng hồ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        // Khi hết thời gian, reset lại (hoặc có thể xử lý khác)
        return { hours: 2, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Danh sách sản phẩm flash sale
  const flashSaleProducts = [
    {
      id: 'fs1',
      name: 'iPhone 15 Pro Max 256GB',
      originalPrice: 32990000,
      salePrice: 27990000,
      percentOff: 15,
      image: 'https://picsum.photos/seed/iphone15/300/300',
      sold: 120,
      total: 200
    },
    {
      id: 'fs2',
      name: 'Samsung Galaxy S24 Ultra',
      originalPrice: 29990000,
      salePrice: 26990000,
      percentOff: 10,
      image: 'https://picsum.photos/seed/samsungs24/300/300',
      sold: 85,
      total: 150
    },
    {
      id: 'fs3',
      name: 'MacBook Air M3',
      originalPrice: 27990000,
      salePrice: 22990000,
      percentOff: 18,
      image: 'https://picsum.photos/seed/macbookm3/300/300',
      sold: 50,
      total: 100
    },
    {
      id: 'fs4',
      name: 'iPad Air 2023',
      originalPrice: 16990000,
      salePrice: 13590000,
      percentOff: 20,
      image: 'https://picsum.photos/seed/ipadair/300/300',
      sold: 75,
      total: 100
    },
    {
      id: 'fs5',
      name: 'PlayStation 5',
      originalPrice: 14990000,
      salePrice: 11990000,
      percentOff: 20,
      image: 'https://picsum.photos/seed/ps5/300/300',
      sold: 90,
      total: 100
    },
    {
      id: 'fs6',
      name: 'AirPods Pro 2',
      originalPrice: 6790000,
      salePrice: 5490000,
      percentOff: 19,
      image: 'https://picsum.photos/seed/airpods/300/300',
      sold: 65,
      total: 150
    }
  ];

  // Format số với dấu phân cách
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <img 
                src="https://salt.tikicdn.com/ts/upload/93/23/f7/1a8d8d0978980052cd5e21ab9215f1de.png" 
                alt="Flash Deal" 
                className="h-8 mr-2"
              />
              <h2 className="text-xl font-bold text-red-600">FLASH SALE</h2>
            </div>
            <div className="flex items-center ml-6">
              <div className="text-sm font-medium text-slate-600 mr-2">Kết thúc trong</div>
              <div className="flex space-x-1">
                <div className="w-7 h-7 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                  {String(timeRemaining.hours).padStart(2, '0').split('')[0]}
                </div>
                <div className="w-7 h-7 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                  {String(timeRemaining.hours).padStart(2, '0').split('')[1]}
                </div>
                <div className="text-slate-800 font-bold">:</div>
                <div className="w-7 h-7 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                  {String(timeRemaining.minutes).padStart(2, '0').split('')[0]}
                </div>
                <div className="w-7 h-7 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                  {String(timeRemaining.minutes).padStart(2, '0').split('')[1]}
                </div>
                <div className="text-slate-800 font-bold">:</div>
                <div className="w-7 h-7 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                  {String(timeRemaining.seconds).padStart(2, '0').split('')[0]}
                </div>
                <div className="w-7 h-7 bg-slate-800 text-white flex items-center justify-center rounded-sm">
                  {String(timeRemaining.seconds).padStart(2, '0').split('')[1]}
                </div>
              </div>
            </div>
          </div>
          <Link to="/flash-sale" className="text-red-600 font-medium hover:text-red-700 flex items-center text-sm">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Sản phẩm */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 -mx-2 scrollbar-hide">
            {flashSaleProducts.map(product => (
              <div key={product.id} className="flex-shrink-0 w-40 md:w-48 px-2">
                <Link to={`/products/${product.id}`} className="block">
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-40 object-contain p-2" />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.percentOff}%
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-slate-800 text-sm line-clamp-2 mb-2">{product.name}</h3>
                      <div className="flex items-baseline mb-2">
                        <span className="text-red-600 font-bold text-base">{formatPrice(product.salePrice)}</span>
                        <span className="text-slate-500 text-xs line-through ml-2">{formatPrice(product.originalPrice)}</span>
                      </div>
                      <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-red-500" 
                          style={{ width: `${(product.sold / product.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1 font-medium text-red-600">
                        {product.sold > product.total * 0.7 ? 'SẮP HẾT HÀNG' : `ĐÃ BÁN ${product.sold}`}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Điều hướng (tuỳ chọn) */}
          <button className="hidden md:block absolute -left-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlashSale; 