import React, { useEffect, useState } from "react";
import { productsAPI, categoriesAPI } from "../utils/api";
import SidebarFilter from "../components/SidebarFilter";
import ProductCard from "../components/ProductCard";
import ProductHeaderBar from "../components/ProductHeaderBar";
import CategoryOptionBar from "../components/CategoryOptionBar";
import { useLocation, useSearchParams } from "react-router-dom";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // State for data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    categories: searchParams.has('category') ? searchParams.get('category').split(',') : [],
    brands: searchParams.has('brand') ? searchParams.get('brand').split(',') : [],
    rating: searchParams.has('rating') ? Number(searchParams.get('rating')) : 0,
    keyword: searchParams.get('keyword') || "",
  });
  
  // Price range and sort
  const [priceRange, setPriceRange] = useState([
    searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : 50000000
  ]);
  
  const [sort, setSort] = useState(searchParams.get('sort') || "featured");
  const [viewMode, setViewMode] = useState("grid");
  
  // Load categories and brands on mount
  useEffect(() => {
    // Load filter data (categories, brands)
    Promise.all([
      categoriesAPI.getCategories(),
      productsAPI.getBrands()
    ]).then(([categoriesRes, brandsRes]) => {
      setCategories(categoriesRes.data?.data || []);
      setBrands(brandsRes.data?.data || []);
    });
    
    // Apply initial filters from URL if present
    if (location.search) {
      fetchProducts();
    }
  }, []);

  // Fetch products with filters
  const fetchProducts = () => {
    setLoading(true);
    
    const params = {
      category: filters.categories.length ? filters.categories.join(",") : undefined,
      brand: filters.brands.length ? filters.brands.join(",") : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 50000000 ? priceRange[1] : undefined,
      rating: filters.rating > 0 ? filters.rating : undefined,
      keyword: filters.keyword || undefined,
      sort: sort !== "featured" ? sort : undefined,
      page: 1,
      limit: 20
    };
    
    // Update URL with new filters
    setSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {})
    );
    
    // Fetch products from API
    productsAPI.getProducts(params)
      .then(res => {
        setProducts(res.data?.data || []);
        setTotalProducts(res.data?.meta?.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  };

  // Apply filters when changed
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [filters, priceRange, sort]);

  // Handle filter actions
  const handleApply = () => fetchProducts();
  
  const handleReset = () => {
    setFilters({
      categories: [],
      brands: [],
      rating: 0,
      keyword: "",
    });
    setPriceRange([0, 50000000]);
    setSort("featured");
  };

  // Determine active category
  const getActiveCategory = () => {
    if (!filters.categories.length) return 'all';
    
    // Map the API category to our UI category
    const categoryMap = {
      'computer': 'computer',
      'tv': 'tv',
      'smart-home': 'smart-home',
      'gaming': 'gaming',
      'accessories': 'accessories',
      'speaker': 'speaker',
      'pc': 'pc',
      'powerbank': 'powerbank',
      'monitor': 'monitor',
      'phone': 'phone',
    };
    
    return categoryMap[filters.categories[0]] || 'all';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CategoryOptionBar activeCategory={getActiveCategory()} />
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">Sản phẩm</h1>
          </div>
          <p className="text-gray-600">Khám phá các sản phẩm công nghệ mới nhất với giá ưu đãi</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <SidebarFilter
            categories={categories}
            brands={brands}
            filters={filters}
            setFilters={setFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onApply={handleApply}
            onReset={handleReset}
          />
          
          {/* Product Listing */}
          <main className="lg:w-3/4">
            <ProductHeaderBar
              total={totalProducts}
              sort={sort}
              setSort={setSort}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            
            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm nào</h3>
                <p className="text-gray-600 mb-6">Vui lòng thử với bộ lọc khác hoặc xem tất cả sản phẩm</p>
                <button 
                  onClick={handleReset} 
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              /* Product Grid/List */
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
              }>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 