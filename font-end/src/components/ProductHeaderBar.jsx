import React from "react";

const sortOptions = [
  { value: "featured", label: "Nổi bật", icon: "fa-star" },
  { value: "newest", label: "Mới nhất", icon: "fa-clock" },
  { value: "price-asc", label: "Giá thấp đến cao", icon: "fa-arrow-down-wide-short" },
  { value: "price-desc", label: "Giá cao đến thấp", icon: "fa-arrow-up-wide-short" },
  { value: "name-asc", label: "Tên A-Z", icon: "fa-arrow-down-a-z" },
];

const ProductHeaderBar = ({
  total,
  sort,
  setSort,
  viewMode,
  setViewMode
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
    {/* Product Count */}
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
        <i className="fas fa-boxes-stacked"></i>
      </div>
      <div>
        <p className="text-sm text-gray-500">Tìm thấy</p>
        <p className="font-bold text-gray-800">{total} sản phẩm</p>
      </div>
    </div>

    {/* Controls */}
    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
      {/* View Mode Switcher */}
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          className={`px-3 py-1.5 rounded-md flex items-center justify-center transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setViewMode('grid')}
          aria-label="Dạng lưới"
        >
          <i className="fas fa-grid-2 mr-1.5"></i>
          <span className="text-sm font-medium">Lưới</span>
        </button>
        <button
          className={`px-3 py-1.5 rounded-md flex items-center justify-center transition ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setViewMode('list')}
          aria-label="Dạng danh sách"
        >
          <i className="fas fa-list mr-1.5"></i>
          <span className="text-sm font-medium">Danh sách</span>
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 ml-1">
          <i className="fas fa-arrow-down-wide-short"></i>
          <span>Sắp xếp theo</span>
        </div>
        <select
          className="appearance-none pl-3 pr-8 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[180px]"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
          <i className="fas fa-chevron-down"></i>
        </span>
      </div>
    </div>
  </div>
);

export default ProductHeaderBar; 