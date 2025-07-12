import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronRight, 
  faChevronLeft,
  faTablet, 
  faDesktop, 
  faMobileScreen, 
  faTv, 
  faGamepad, 
  faHeadphones, 
  faLaptop,
  faHouse,
  faBatteryFull,
  faComputer,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';

/**
 * CategoryOptionBar component for displaying a scrollable category filter bar
 * 
 * @param {Object} props - Component props
 * @param {string} [props.activeCategory='all'] - Currently active category ID
 * @param {boolean} [props.hideTitle=false] - Whether to hide the section title
 * @param {Array} [props.categories] - Optional custom categories array
 * @param {string} [props.title='Sản phẩm nổi bật'] - Section title text
 * @param {string} [props.subtitle='Những sản phẩm công nghệ hot nhất hiện nay'] - Section subtitle text
 * @param {Function} [props.onCategoryChange] - Optional callback when category changes
 * @returns {JSX.Element}
 */
const CategoryOptionBar = ({ 
  activeCategory = 'all', 
  hideTitle = false,
  categories: propCategories,
  title = 'Sản phẩm nổi bật',
  subtitle = 'Những sản phẩm công nghệ hot nhất hiện nay',
  onCategoryChange
}) => {
  const scrollRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const location = useLocation();

  // Default categories with icons if not provided
  const defaultCategories = [
    { id: 'all', name: 'Tất cả', path: '/products', icon: faEllipsisVertical },
    { id: 'phone', name: 'Điện thoại', path: '/products?category=phone', icon: faMobileScreen },
    { id: 'laptop', name: 'Laptop', path: '/products?category=laptop', icon: faLaptop },
    { id: 'tablet', name: 'Máy tính bảng', path: '/products?category=tablet', icon: faTablet },
    { id: 'tv', name: 'TV', path: '/products?category=tv', icon: faTv },
    { id: 'smart-home', name: 'Nhà thông minh', path: '/products?category=smart-home', icon: faHouse },
    { id: 'gaming', name: 'Gaming', path: '/products?category=gaming', icon: faGamepad },
    { id: 'accessories', name: 'Phụ kiện', path: '/products?category=accessories', icon: faHeadphones },
    { id: 'pc', name: 'PC', path: '/products?category=pc', icon: faComputer },
    { id: 'powerbank', name: 'Sạc dự phòng', path: '/products?category=powerbank', icon: faBatteryFull },
    { id: 'monitor', name: 'Màn hình', path: '/products?category=monitor', icon: faDesktop },
  ];

  const categories = propCategories || defaultCategories;

  // Check scroll position to show/hide scroll buttons
  const checkScrollPosition = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    
    setShowLeftScroll(scrollElement.scrollLeft > 10);
    setShowRightScroll(
      scrollElement.scrollLeft < 
      scrollElement.scrollWidth - scrollElement.clientWidth - 10
    );
  };

  // Add horizontal scroll with mouse wheel
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollRef.current) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          scrollRef.current.scrollLeft += e.deltaY;
          checkScrollPosition();
        }
      }
    };

    const handleScroll = () => {
      checkScrollPosition();
    };

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener('wheel', handleWheel, { passive: false });
      currentScrollRef.addEventListener('scroll', handleScroll);
      // Initial check
      checkScrollPosition();
    }

    // Check if we need to scroll to make the active category visible
    setTimeout(() => {
      if (currentScrollRef && activeCategory !== 'all') {
        const activeElement = currentScrollRef.querySelector(`[data-category="${activeCategory}"]`);
        if (activeElement) {
          // Scroll to make active element visible and centered if possible
          const scrollLeft = activeElement.offsetLeft - (currentScrollRef.clientWidth / 2) + (activeElement.clientWidth / 2);
          currentScrollRef.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
          });
        }
      }
    }, 100);

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('wheel', handleWheel);
        currentScrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeCategory]);

  const scrollAction = (direction) => {
    if (isScrolling || !scrollRef.current) return;
    
    setIsScrolling(true);
    const scrollAmount = scrollRef.current.clientWidth / 2;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    
    setTimeout(() => setIsScrolling(false), 300);
  };

  const getCategoryFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'all';
  };

  const currentCategory = activeCategory || getCategoryFromUrl();

  return (
    <div className="w-full bg-white py-6">
      <div className="container mx-auto px-4 md:px-6">
        {!hideTitle && (
          <div className="text-center md:text-left mb-5">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-600 mt-1">{subtitle}</p>
          </div>
        )}
        
        <div className="relative">
          {/* Scroll Left Button */}
          {showLeftScroll && (
            <button 
              onClick={() => scrollAction('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          
          {/* Category Buttons */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 no-scrollbar py-1 px-2 -mx-2 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categories.map((category) => {
              const isActive = currentCategory === category.id;
              return (
                <Link
                  key={category.id}
                  to={category.path}
                  data-category={category.id}
                  onClick={(e) => {
                    if (onCategoryChange) {
                      e.preventDefault();
                      onCategoryChange(category.id);
                    }
                  }}
                  className={`
                    flex-shrink-0 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-medium
                    flex items-center gap-2 hover:shadow-sm transform hover:-translate-y-0.5
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-sm border border-indigo-600' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-500 hover:text-indigo-700'
                    }
                  `}
                >
                  {category.icon && (
                    <FontAwesomeIcon 
                      icon={category.icon} 
                      className={isActive ? 'text-white' : 'text-indigo-500'} 
                    />
                  )}
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Scroll Right Button */}
          {showRightScroll && (
            <button 
              onClick={() => scrollAction('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
          
          {/* Gradient Fades */}
          {showLeftScroll && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-0 pointer-events-none" />
          )}
          {showRightScroll && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-0 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryOptionBar; 