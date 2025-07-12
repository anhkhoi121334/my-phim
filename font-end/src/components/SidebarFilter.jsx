import React, { useState, useEffect } from "react";
import PriceSlider from "./PriceSlider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter, 
  faRotateLeft, 
  faChevronDown, 
  faXmark, 
  faCheck,
  faSliders,
  faStar,
  faCircle
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

const SidebarFilter = ({
  categories = [], 
  brands = [], 
  filters = {
    categories: [],
    brands: [],
    rating: 0,
  }, 
  setFilters, 
  priceRange = [0, 50000000], 
  setPriceRange, 
  onApply, 
  onReset,
  onlyShowMobile = false
}) => {
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.categories?.length > 0) count++;
    if (filters.brands?.length > 0) count++;
    if (filters.rating > 0) count++;
    if (priceRange && (priceRange[0] > 0 || priceRange[1] < 50000000)) count++;
    setActiveFiltersCount(count);
  }, [filters, priceRange]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Render section header with toggle
  const renderSectionHeader = (title, section, onClear) => (
    <div className="flex justify-between items-center mb-3 select-none">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => toggleSection(section)}
      >
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`text-xs transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''}`}
        />
      </div>
      <button 
        className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
      >
        Xóa
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className={`lg:${onlyShowMobile ? 'block' : 'hidden'} w-full sticky top-0 z-20 bg-white py-3 shadow-sm mb-4`}>
        <button 
          onClick={() => setIsMobileFilterVisible(!isMobileFilterVisible)}
          className="w-full bg-white border border-slate-200 text-slate-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <FontAwesomeIcon icon={faSliders} className="text-indigo-600" />
          <span>Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Backdrop for mobile filter */}
      {isMobileFilterVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileFilterVisible(false)}
        />
      )}

      <aside className={`
        ${onlyShowMobile ? 'hidden' : 'block'} 
        lg:block lg:w-1/4 
        ${isMobileFilterVisible ? 'fixed inset-0 z-40 p-4 overflow-y-auto bg-white lg:static lg:p-0 lg:bg-transparent lg:overflow-visible' : 'hidden'}
      `}>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Mobile header */}
          {isMobileFilterVisible && (
            <div className="flex justify-between items-center p-4 border-b border-slate-100 lg:hidden">
              <h2 className="text-lg font-bold text-slate-800">Bộ lọc</h2>
              <button 
                onClick={() => setIsMobileFilterVisible(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}
          
          <div className="p-5">
            {/* Filter header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-indigo-600" />
                <span>Bộ lọc</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-indigo-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </h2>
              <button 
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1.5 transition-colors" 
                onClick={onReset}
              >
                <FontAwesomeIcon icon={faRotateLeft} /> Reset
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-5">
              {renderSectionHeader(
                'Danh mục', 
                'categories', 
                () => setFilters(f => ({ ...f, categories: [] }))
              )}
              
              <div 
                className={`space-y-1.5 overflow-hidden transition-all duration-300 ${
                  expandedSections.categories 
                    ? 'max-h-48 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="scrollable-container max-h-44 overflow-y-auto pr-2 pb-2">
                  <div className="flex items-center p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      id="all-categories" 
                      checked={filters.categories.length === 0}
                      onChange={() => setFilters(f => ({ ...f, categories: [] }))}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
                    />
                    <label htmlFor="all-categories" className="ml-2 text-slate-700 cursor-pointer text-sm flex-grow">
                      Tất cả
                    </label>
                  </div>
                  
                  {categories.map(cat => (
                    <div key={cat._id} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center flex-grow">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(cat._id)}
                          onChange={() =>
                            setFilters(f => ({
                              ...f,
                              categories: f.categories.includes(cat._id)
                                ? f.categories.filter(id => id !== cat._id)
                                : [...f.categories, cat._id]
                            }))
                          }
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                          id={`cat-${cat._id}`}
                        />
                        <label htmlFor={`cat-${cat._id}`} className="ml-2 text-slate-700 cursor-pointer text-sm flex-grow">
                          {cat.name}
                        </label>
                      </div>
                      {cat.count !== undefined && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-5 pt-2 border-t border-slate-100">
              {renderSectionHeader(
                'Khoảng giá', 
                'price', 
                () => setPriceRange([0, 50000000])
              )}
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  expandedSections.price 
                    ? 'max-h-32 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <PriceSlider min={0} max={50000000} value={priceRange} onChange={setPriceRange} />
                <div className="flex justify-between mt-2 text-xs text-slate-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>
            
            {/* Brands */}
            <div className="mb-5 pt-2 border-t border-slate-100">
              {renderSectionHeader(
                'Thương hiệu', 
                'brands', 
                () => setFilters(f => ({ ...f, brands: [] }))
              )}
              
              <div 
                className={`space-y-1.5 overflow-hidden transition-all duration-300 ${
                  expandedSections.brands 
                    ? 'max-h-48 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="scrollable-container max-h-44 overflow-y-auto pr-2 pb-2">
                  {brands.length > 0 ? brands.map(brand => (
                    <div key={brand} className="flex items-center p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() =>
                          setFilters(f => ({
                            ...f,
                            brands: f.brands.includes(brand)
                              ? f.brands.filter(b => b !== brand)
                              : [...f.brands, brand]
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        id={`brand-${brand}`}
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-2 text-slate-700 cursor-pointer text-sm">
                        {brand}
                      </label>
                    </div>
                  )) : (
                    <div className="text-sm text-slate-500 italic">Không có thương hiệu</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ratings */}
            <div className="mb-5 pt-2 border-t border-slate-100">
              {renderSectionHeader(
                'Đánh giá', 
                'rating', 
                () => setFilters(f => ({ ...f, rating: 0 }))
              )}
              
              <div 
                className={`space-y-1.5 overflow-hidden transition-all duration-300 ${
                  expandedSections.rating 
                    ? 'max-h-48 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex items-center p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    checked={filters.rating === 0}
                    onChange={() => setFilters(f => ({ ...f, rating: 0 }))}
                    name="rating"
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    id="rating-all"
                  />
                  <label htmlFor="rating-all" className="ml-2 text-slate-700 cursor-pointer text-sm">
                    Tất cả đánh giá
                  </label>
                </div>
                
                {[5, 4, 3, 2, 1].map(r => (
                  <div key={r} className="flex items-center p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      checked={filters.rating === r}
                      onChange={() => setFilters(f => ({ ...f, rating: r }))}
                      name="rating"
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      id={`rating-${r}`}
                    />
                    <label htmlFor={`rating-${r}`} className="ml-2 flex items-center cursor-pointer">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon 
                          key={i} 
                          icon={i < r ? faStar : farStar} 
                          className={i < r ? 'text-amber-400' : 'text-slate-300'} 
                          size="sm"
                        />
                      ))}
                      <span className="ml-1.5 text-slate-700 text-sm">& trở lên</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Status filters (New, Sale, etc.) */}
            <div className="mb-6 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Trạng thái</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center p-1.5 rounded-lg border border-slate-200 hover:border-indigo-500 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faCircle} className="text-green-500 text-xs" />
                  <span className="ml-2 text-sm text-slate-700">Còn hàng</span>
                </div>
                <div className="flex items-center p-1.5 rounded-lg border border-slate-200 hover:border-indigo-500 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faCircle} className="text-rose-500 text-xs" />
                  <span className="ml-2 text-sm text-slate-700">Giảm giá</span>
                </div>
                <div className="flex items-center p-1.5 rounded-lg border border-slate-200 hover:border-indigo-500 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faCircle} className="text-amber-500 text-xs" />
                  <span className="ml-2 text-sm text-slate-700">Mới</span>
                </div>
              </div>
            </div>
            
            {/* Apply / Clear Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                onClick={() => {
                  onApply();
                  setIsMobileFilterVisible(false);
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>Áp dụng</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-indigo-600 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ml-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                onClick={() => {
                  onReset();
                  setIsMobileFilterVisible(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
                <span>Xóa tất cả</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarFilter; 