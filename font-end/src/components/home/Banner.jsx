import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { bannersAPI } from '../../utils/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const Banner = ({ position = 'home_main' }) => {
  const [isClient, setIsClient] = useState(false);
  
  // Only enable client-side features after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch banners for the specified position
  const { data: bannersResponse, isLoading, error } = useQuery(
    ['banners', position],
    () => bannersAPI.getBannersByPosition(position),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  const banners = bannersResponse?.data?.data || [];

  // Default fallback banners if none are available from API
  const fallbackBanners = [
    {
      _id: 'default-1',
      title: 'Khám phá bộ sưu tập laptop mới nhất',
      description: 'Hiệu năng vượt trội với chip mới nhất và thiết kế sang trọng',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1900&q=80',
      linkUrl: '/products?category=laptop',
    },
    {
      _id: 'default-2',
      title: 'Khám phá thế giới với Galaxy S23 Ultra',
      description: 'Camera chuyên nghiệp, hiệu năng mạnh mẽ và pin siêu trâu',
      imageUrl: 'https://images.unsplash.com/photo-1616410011236-7a42121dd981?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1900&q=80',
      linkUrl: '/products?category=phone',
    },
  ];

  // Use fallback banners if there's an error, loading, or no banners
  const displayBanners = banners.length > 0 ? banners : fallbackBanners;

  return (
    <div className="relative overflow-hidden">
      {isClient ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={position === 'home_main'}
          className="banner-swiper"
        >
          {displayBanners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <div className="relative">
                {/* Banner Image */}
                <div className="aspect-[16/5] md:aspect-[21/9] lg:aspect-[21/7]">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/1200x400?text=Banner+Image';
                    }}
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent flex items-center">
                  <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="w-full md:w-1/2 lg:w-2/5 text-white space-y-4 p-6 md:p-8">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        {banner.title}
                      </h2>
                      {banner.description && (
                        <p className="text-sm md:text-base text-white/80">
                          {banner.description}
                        </p>
                      )}
                      {banner.linkUrl && (
                        <Link
                          to={banner.linkUrl}
                          className="inline-block mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105"
                        >
                          Khám phá ngay
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Static fallback for SSR
        <div className="relative">
          <div className="aspect-[16/5] md:aspect-[21/9] lg:aspect-[21/7]">
            <img
              src={fallbackBanners[0].imageUrl}
              alt={fallbackBanners[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="w-full md:w-1/2 lg:w-2/5 text-white space-y-4 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {fallbackBanners[0].title}
                </h2>
                <p className="text-sm md:text-base text-white/80">
                  {fallbackBanners[0].description}
                </p>
                <Link
                  to={fallbackBanners[0].linkUrl}
                  className="inline-block mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
                >
                  Khám phá ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && position !== 'home_main' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-md">
            <p className="text-red-500">Lỗi khi tải banner</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
