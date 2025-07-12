import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI } from '../utils/api';
import { generateRandomProduct } from '../utils/randomGenerator';
import AdminLayout from '../components/layout/AdminLayout';

// Stats icons and colors config
const statsConfig = [
  { label: 'Tổng sản phẩm', icon: "fas fa-box", bg: 'bg-indigo-100', textColor: 'text-indigo-600' },
  { label: 'Đang kinh doanh', icon: "fas fa-check-circle", bg: 'bg-emerald-100', textColor: 'text-emerald-600' },
  { label: 'Hết hàng', icon: "fas fa-exclamation-circle", bg: 'bg-amber-100', textColor: 'text-amber-600' },
  { label: 'Ngừng kinh doanh', icon: "fas fa-times-circle", bg: 'bg-rose-100', textColor: 'text-rose-600' },
];

const ProductManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    status: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Add product form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    brand: '',
    category: '',
    subCategory: '',
    mainImage: 'https://picsum.photos/600/600',
    images: [],
    basePrice: '',
    tags: [],
    isActive: true,
    variants: [
      {
        sku: '',
        name: '',
        price: '',
        originalPrice: '',
        stock: 10,
        images: [],
        attributes: {
          color: '',
          ram: '',
          storage: ''
        }
      }
    ],
    specifications: [
      {
        category: '',
        name: '',
        value: '',
        unit: '',
        isHighlighted: false
      }
    ]
  });

  // State for managing dynamic form arrays
  const [variantCount, setVariantCount] = useState(1);
  const [specCount, setSpecCount] = useState(1);
  const [tagInput, setTagInput] = useState('');

  // Query to fetch products from API
  const { data: productsResponse, isLoading: productsLoading, isError: isErrorProducts, error: productsError } = useQuery(
    'products', 
    productsAPI.getProducts,
    {
      onSuccess: (response) => {
        console.log('Products data received:', response);
        // Extract products array from response
        const productsData = response?.data?.data || [];
        setFilteredProducts(productsData);
        
        // Check variants structure for each product
        productsData.forEach(product => {
          console.log(`Product "${product.name}" variants:`, product.variants);
        });
      },
      onError: (error) => {
        toast.error(`Lỗi tải sản phẩm: ${error.message}`);
      }
    }
  );
  
  // Query to fetch categories for filter dropdown
  const { data: categoriesData } = useQuery(
    'categories',
    () => categoriesAPI.getCategories()
  );
  
  // Get products and categories from the API response
  const products = productsResponse?.data?.data || [];
  const categories = categoriesData?.data?.data || [];
  
  // Apply filters
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      let result = [...products];
      
      // Filter by category
      if (filters.category) {
        result = result.filter(product => 
          product.category?._id === filters.category || 
          product.category?.name?.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (min && max) {
          result = result.filter(product => product.basePrice >= min && product.basePrice <= max);
        } else if (min) {
          result = result.filter(product => product.basePrice >= min);
        } else if (max) {
          result = result.filter(product => product.basePrice <= max);
        }
      }
      
      // Filter by status
      if (filters.status) {
        if (filters.status === 'out-of-stock') {
          result = result.filter(product => product.stock <= 0);
        } else {
          result = result.filter(product => product.isActive === (filters.status === 'active'));
        }
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.sku?.toLowerCase().includes(searchTerm) ||
          product.brand?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm)
        );
      }
      
      setFilteredProducts(result);
    } else {
      setFilteredProducts([]);
    }
  }, [filters, products]);

  // Calculate stats from actual data
  const productStats = statsConfig.map(config => {
    let value = 0;
    
    if (Array.isArray(products)) {
    if (config.label === 'Tổng sản phẩm') {
      value = products.length;
    } else if (config.label === 'Đang kinh doanh') {
      value = products.filter(p => p.isActive).length;
    } else if (config.label === 'Hết hàng') {
      value = products.filter(p => p.stock <= 0).length;
    } else if (config.label === 'Ngừng kinh doanh') {
      value = products.filter(p => !p.isActive).length;
      }
    }
    
    return { ...config, value };
  });

  // Add mutation for creating products
  const createProductMutation = useMutation(
    (productData) => productsAPI.createProduct(productData),
    {
    onSuccess: () => {
        toast.success('Sản phẩm đã được tạo thành công!');
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
        toast.error(`Lỗi khi tạo sản phẩm: ${error.toString()}`);
      }
    }
  );
  
  // Generate random products
  const handleGenerateRandomProducts = () => {
    // Define productCount with a default value of 1
    const productCount = 1;
    
    if (!categories || categories.length === 0) {
      // Tạo danh mục mặc định nếu không có danh mục nào
      const defaultCategory = {
        name: "Sản phẩm điện tử",
        description: "Danh mục sản phẩm điện tử mặc định",
        icon: "fas fa-mobile-alt",
        isActive: true,
        isFeatured: true
      };
      
      toast.info('Đang tạo danh mục mặc định trước khi tạo sản phẩm...');
      
      // Tạo danh mục mặc định
      categoriesAPI.createCategory(defaultCategory)
        .then(response => {
          const newCategory = response.data.data;
          toast.success(`Đã tạo danh mục mặc định: ${newCategory.name}`);
          
          // Tạo sản phẩm với danh mục vừa tạo
          const randomProduct = generateRandomProduct(
            newCategory._id,
            null,
            newCategory.name,
            ''
          );
          
          // Tạo sản phẩm
          createProductMutation.mutate(randomProduct);
          
          // Làm mới danh sách danh mục
          queryClient.invalidateQueries('categories');
        })
        .catch(err => {
          toast.error(`Lỗi khi tạo danh mục mặc định: ${err.message}`);
        });
      
      return;
    }
    
    // Show a custom dialog with a dropdown to select a category
    const selectCategoryDialog = document.createElement('div');
    selectCategoryDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    selectCategoryDialog.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Chọn danh mục</h3>
        <select id="category-select" class="w-full p-2 border border-slate-300 rounded-md mb-4">
          ${categories.map((cat, idx) => `
            <option value="${cat._id}:${cat.name}">${cat.name}</option>
            ${cat.subcategories && cat.subcategories.map((subCat, subIdx) => 
              `<option value="${cat._id}:${subCat._id}:${cat.name}:${subCat.name}">-- ${cat.name} > ${subCat.name}</option>`
            ).join('')}
          `).join('')}
        </select>
        <div class="flex justify-end space-x-3">
          <button id="cancel-btn" class="px-4 py-2 bg-slate-200 text-slate-800 rounded-md">Hủy</button>
          <button id="confirm-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Tạo sản phẩm</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(selectCategoryDialog);
    
    // Add event listeners
    document.getElementById('cancel-btn').addEventListener('click', () => {
      document.body.removeChild(selectCategoryDialog);
    });
    
    document.getElementById('confirm-btn').addEventListener('click', () => {
      const selectValue = document.getElementById('category-select').value;
      document.body.removeChild(selectCategoryDialog);
      
      let categoryId;
      let subCategoryId = null;
      let categoryName = '';
      let subCategoryName = '';
      
      const parts = selectValue.split(':');
      
      if (parts.length === 2) {
        // Selected a parent category only
        [categoryId, categoryName] = parts;
      } else if (parts.length === 4) {
        // Selected a subcategory
        [categoryId, subCategoryId, categoryName, subCategoryName] = parts;
      }
      
      if (!categoryId || !categoryName) {
        toast.error('Không thể xác định thông tin danh mục!');
        return;
      }
      
      toast.success(`Đang tạo sản phẩm ngẫu nhiên trong danh mục ${categoryName}${subCategoryName ? ` > ${subCategoryName}` : ''}...`);
      
      const randomProduct = generateRandomProduct(
        categoryId,
        subCategoryId,
        categoryName,
        subCategoryName
      );
      
      if (randomProduct) {
        createProductMutation.mutate(randomProduct);
      } else {
        toast.error('Không thể tạo sản phẩm với danh mục đã chọn!');
      }
    });
  };
  
  // Function to generate multiple random products
  const handleGenerateMultipleProducts = () => {
    const count = window.prompt('Nhập số lượng sản phẩm ngẫu nhiên muốn tạo (tối đa 10):', '5');
    if (!count) return;
    
    const productCount = Math.min(Math.max(1, parseInt(count)), 10);
    
    if (!categories || categories.length === 0) {
      // Tạo danh mục mặc định nếu không có danh mục nào
      const defaultCategory = {
        name: "Sản phẩm điện tử",
        description: "Danh mục sản phẩm điện tử mặc định",
        icon: "fas fa-mobile-alt",
        isActive: true,
        isFeatured: true
      };
      
      toast.info('Đang tạo danh mục mặc định trước khi tạo sản phẩm...');
      
      // Tạo danh mục mặc định
      categoriesAPI.createCategory(defaultCategory)
        .then(response => {
          const newCategory = response.data.data;
          toast.success(`Đã tạo danh mục mặc định: ${newCategory.name}`);
          
          toast.success(`Đang tạo ${productCount} sản phẩm ngẫu nhiên...`);
          
          // Tạo nhiều sản phẩm với danh mục vừa tạo
          for (let i = 0; i < productCount; i++) {
            setTimeout(() => {
              const randomProduct = generateRandomProduct(
                newCategory._id,
                null,
                newCategory.name,
                ''
              );
              
              // Tạo sản phẩm
              createProductMutation.mutate(randomProduct);
            }, i * 500); // Delay to avoid overwhelming the API
          }
          
          // Làm mới danh sách danh mục
          queryClient.invalidateQueries('categories');
        })
        .catch(err => {
          toast.error(`Lỗi khi tạo danh mục mặc định: ${err.message}`);
        });
      
      return;
    }
    
    // Show a custom dialog with a dropdown to select a category
    const selectCategoryDialog = document.createElement('div');
    selectCategoryDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    selectCategoryDialog.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Chọn danh mục cho ${productCount} sản phẩm</h3>
        <select id="category-select" class="w-full p-2 border border-slate-300 rounded-md mb-4">
          <option value="random">Ngẫu nhiên (mỗi sản phẩm một danh mục)</option>
          ${categories.map((cat, idx) => `
            <option value="${cat._id}:${cat.name}">${cat.name}</option>
            ${cat.subcategories && cat.subcategories.map((subCat, subIdx) => 
              `<option value="${cat._id}:${subCat._id}:${cat.name}:${subCat.name}">-- ${cat.name} > ${subCat.name}</option>`
            ).join('')}
          `).join('')}
        </select>
        <div class="flex justify-end space-x-3">
          <button id="cancel-btn" class="px-4 py-2 bg-slate-200 text-slate-800 rounded-md">Hủy</button>
          <button id="confirm-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Tạo sản phẩm</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(selectCategoryDialog);
    
    // Add event listeners
    document.getElementById('cancel-btn').addEventListener('click', () => {
      document.body.removeChild(selectCategoryDialog);
    });
    
    document.getElementById('confirm-btn').addEventListener('click', () => {
      const selectValue = document.getElementById('category-select').value;
      document.body.removeChild(selectCategoryDialog);
      
      toast.success(`Đang tạo ${productCount} sản phẩm ngẫu nhiên...`);
      
      if (selectValue === 'random') {
        // Random category for each product
        for (let i = 0; i < productCount; i++) {
          setTimeout(() => {
            // Get a random category
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            
            if (!randomCategory) {
              toast.error('Không thể tìm thấy danh mục!');
              return;
            }
            
            let subCategoryId = null;
            let subCategoryName = '';
            
            // Check if category has subcategories and randomly select one
            if (randomCategory.subcategories && randomCategory.subcategories.length > 0 && Math.random() > 0.5) {
              const randomSubCategory = randomCategory.subcategories[Math.floor(Math.random() * randomCategory.subcategories.length)];
              subCategoryId = randomSubCategory._id;
              subCategoryName = randomSubCategory.name;
            }
            
            // Generate random product with category information
            const randomProduct = generateRandomProduct(
              randomCategory._id,
              subCategoryId,
              randomCategory.name,
              subCategoryName
            );
            
            if (randomProduct) {
              // Create product via API
              createProductMutation.mutate(randomProduct);
            }
          }, i * 500); // Delay to avoid overwhelming the API
        }
      } else {
        // Use selected category for all products
        let categoryId;
        let subCategoryId = null;
        let categoryName = '';
        let subCategoryName = '';
        
        const parts = selectValue.split(':');
        
        if (parts.length === 2) {
          // Selected a parent category only
          [categoryId, categoryName] = parts;
        } else if (parts.length === 4) {
          // Selected a subcategory
          [categoryId, subCategoryId, categoryName, subCategoryName] = parts;
        }
        
        if (!categoryId || !categoryName) {
          toast.error('Không thể xác định thông tin danh mục!');
          return;
        }
        
        // Create multiple products with the selected category
        for (let i = 0; i < productCount; i++) {
          setTimeout(() => {
            // Generate random product with category information
            const randomProduct = generateRandomProduct(
              categoryId, 
              subCategoryId, 
              categoryName,
              subCategoryName
            );
            
            if (randomProduct) {
              // Create product via API
              createProductMutation.mutate(randomProduct);
            }
          }, i * 500); // Delay to avoid overwhelming the API
        }
      }
    });
  };

  // Mutation for deleting a product
  const deleteProductMutation = useMutation(productsAPI.deleteProduct, {
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!');
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể xóa sản phẩm'}`);
    }
  });

  // Add deleteAllProductsMutation
  const deleteAllProductsMutation = useMutation(productsAPI.deleteAllProducts, {
    onSuccess: () => {
      toast.success('Đã xóa tất cả sản phẩm thành công!');
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể xóa tất cả sản phẩm'}`);
    }
  });

  // Form change for simple fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle variant changes
  const handleVariantChange = (index, field, value) => {
    setForm(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = { 
        ...updatedVariants[index], 
        [field]: value 
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  // Handle variant attribute changes
  const handleVariantAttributeChange = (variantIndex, attributeKey, value) => {
    setForm(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex] = { 
        ...updatedVariants[variantIndex],
        attributes: {
          ...updatedVariants[variantIndex].attributes,
          [attributeKey]: value
        }
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  // Handle specification changes
  const handleSpecChange = (index, field, value) => {
    setForm(prev => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[index] = { 
        ...updatedSpecs[index], 
        [field]: field === 'isHighlighted' ? value === 'true' : value 
      };
      return { ...prev, specifications: updatedSpecs };
    });
  };

  // Add variant
  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: '',
          name: '',
          price: '',
          originalPrice: '',
          stock: 10,
          images: [],
          attributes: {
            color: '',
            ram: '',
            storage: ''
          }
        }
      ]
    }));
    setVariantCount(prev => prev + 1);
  };

  // Remove variant
  const removeVariant = (index) => {
    if (variantCount > 1) {
      setForm(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
      setVariantCount(prev => prev - 1);
    }
  };

  // Add specification
  const addSpecification = () => {
    setForm(prev => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          category: '',
          name: '',
          value: '',
          unit: '',
          isHighlighted: false
        }
      ]
    }));
    setSpecCount(prev => prev + 1);
  };

  // Remove specification
  const removeSpecification = (index) => {
    if (specCount > 1) {
      setForm(prev => ({
        ...prev,
        specifications: prev.specifications.filter((_, i) => i !== index)
      }));
      setSpecCount(prev => prev - 1);
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Handle tag input keypress
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Form submit
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!form.description.trim()) {
      toast.error('Vui lòng nhập mô tả sản phẩm');
      return;
    }

    if (!form.brand.trim()) {
      toast.error('Vui lòng chọn thương hiệu');
      return;
    }

    if (!form.category.trim()) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    if (!form.basePrice || Number(form.basePrice) <= 0) {
      toast.error('Vui lòng nhập giá sản phẩm hợp lệ');
      return;
    }

    // Process variants to ensure valid data
    const processedVariants = form.variants.filter(v => v.sku.trim() && v.name.trim() && Number(v.price) > 0);

    if (processedVariants.length === 0) {
      toast.error('Vui lòng nhập ít nhất một biến thể sản phẩm hợp lệ');
      return;
    }

    // Process specifications to ensure valid data
    const processedSpecs = form.specifications.filter(s => s.category.trim() && s.name.trim() && s.value.trim());
    
    // Calculate total stock from all variants
    const totalStock = processedVariants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
    
    // Prepare product data with all required fields
    const productData = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      brand: form.brand,
      category: form.category,
      subCategory: form.subCategory || undefined,
      mainImage: form.mainImage,
      images: form.images,
      variants: processedVariants.map(v => ({
        ...v,
        price: Number(v.price),
        originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
        stock: Number(v.stock)
      })),
      specifications: processedSpecs,
      basePrice: Number(form.basePrice),
      stock: totalStock,
      tags: form.tags,
      isActive: form.isActive
    };
    
    console.log('Sending product data:', productData);
    
    // Send product data
    createProductMutation.mutate(productData);
  };

  // Modal open/close
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => {
    setAddModalOpen(false);
    // Reset form
    setForm({
      name: '',
      description: '',
      shortDescription: '',
      brand: '',
      category: '',
      subCategory: '',
      mainImage: 'https://picsum.photos/600/600',
      images: [],
      basePrice: '',
      tags: [],
      isActive: true,
      variants: [
        {
          sku: '',
          name: '',
          price: '',
          originalPrice: '',
          stock: 10,
          images: [],
          attributes: {
            color: '',
            ram: '',
            storage: ''
          }
        }
      ],
      specifications: [
        {
          category: '',
          name: '',
          value: '',
          unit: '',
          isHighlighted: false
        }
      ]
    });
    setVariantCount(1);
    setSpecCount(1);
    setTagInput('');
  };

  // Handle product deletion
  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      status: '',
      search: '',
    });
  };

  // Add handleDeleteAllProducts function
  const handleDeleteAllProducts = () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa TẤT CẢ sản phẩm? Hành động này không thể hoàn tác!');
    
    if (confirmDelete) {
      deleteAllProductsMutation.mutate();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quản lý sản phẩm</h1>
            <p className="text-slate-600 mt-1">Quản lý tất cả sản phẩm trong hệ thống</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap gap-3">
            <button
                onClick={handleGenerateRandomProducts}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                title="Tạo một sản phẩm ngẫu nhiên"
              >
                <i className="fas fa-magic mr-2"></i> Tạo ngẫu nhiên
              </button>
              
              <button
                onClick={handleGenerateMultipleProducts}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                title="Tạo nhiều sản phẩm ngẫu nhiên"
              >
                <i className="fas fa-wand-magic-sparkles mr-2"></i> Tạo nhiều ngẫu nhiên
              </button>
              
              <button 
                onClick={() => setAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i> Thêm sản phẩm
              </button>
              
              <button 
                onClick={handleDeleteAllProducts}
                className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition-colors"
                title="Xóa tất cả sản phẩm"
              >
                <i className="fas fa-trash-alt mr-2"></i> Xóa tất cả
            </button>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {productStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <i className={`${stat.icon} ${stat.textColor} text-xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Bộ lọc nâng cao</h2>
            <button 
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
              onClick={resetFilters}
            >
              <i className="fas fa-redo-alt mr-1"></i> Đặt lại bộ lọc
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục</label>
              <div className="relative">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Khoảng giá</label>
              <div className="relative">
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tất cả giá</option>
                  <option value="0-1000000">Dưới 1 triệu</option>
                  <option value="1000000-5000000">1 - 5 triệu</option>
                  <option value="5000000-10000000">5 - 10 triệu</option>
                  <option value="10000000-20000000">10 - 20 triệu</option>
                  <option value="20000000-50000000">20 - 50 triệu</option>
                  <option value="50000000-">Trên 50 triệu</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
              <div className="relative">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang kinh doanh</option>
                  <option value="out-of-stock">Hết hàng</option>
                  <option value="inactive">Ngừng kinh doanh</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            {/* Advanced Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tìm kiếm nâng cao</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Mã, tên, thương hiệu..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {/* Already applying filters on change */}}
              className="bg-indigo-600 text-white py-2 px-5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              <i className="fas fa-search mr-2"></i>
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-bold text-slate-800">Danh sách sản phẩm</h2>
            <div className="flex items-center gap-3">
              <button className="text-slate-600 p-2 rounded-lg hover:bg-slate-100" title="Xuất dữ liệu">
                <i className="fas fa-file-export"></i>
              </button>
              <button className="text-slate-600 p-2 rounded-lg hover:bg-slate-100" title="In">
                <i className="fas fa-print"></i>
              </button>
              <div className="relative">
                <select className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none">
                  <option>20 sản phẩm</option>
                  <option>50 sản phẩm</option>
                  <option>100 sản phẩm</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </div>

          {productsLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="mt-2 text-slate-500">Đang tải sản phẩm...</p>
            </div>
          ) : isErrorProducts ? (
            <div className="p-6 text-center text-rose-500">
              <i className="fas fa-exclamation-triangle text-xl mb-2"></i>
              <p>Có lỗi xảy ra: {productsError?.message || 'Không thể tải sản phẩm'}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <i className="fas fa-box text-4xl mb-2 opacity-50"></i>
              <p>Không tìm thấy sản phẩm nào</p>
              {Object.values(filters).some(f => f) && (
                <button 
                  onClick={resetFilters}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase">
                      <div className="flex items-center">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-3" />
                        Sản phẩm
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase">SKU</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-500 uppercase">Danh mục</th>
                    <th className="py-4 px-6 text-right text-xs font-medium text-slate-500 uppercase">Giá (₫)</th>
                    <th className="py-4 px-6 text-center text-xs font-medium text-slate-500 uppercase">Tồn kho</th>
                    <th className="py-4 px-6 text-center text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                    <th className="py-4 px-6 text-center text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-3" />
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 mr-4">
                              {product.mainImage ? (
                                <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                  <i className="fas fa-image text-slate-400 text-lg"></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{product.name}</p>
                              <p className="text-slate-500 text-xs">{product.brand}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{product.sku || (product.variants && product.variants.length > 0 ? product.variants[0].sku : '-')}</td>
                      <td className="py-4 px-6">
                        {product.category?.name ? (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            {product.category.name}
                          </span>
                        ) : product.category ? (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            {typeof product.category === 'string' ? 'Danh mục #' + product.category.substring(0, 6) : ''}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-slate-800">
                        {product.basePrice?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={product.stock <= 0 ? "text-rose-600 font-medium" : "text-emerald-600 font-medium"}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          product.isActive 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-slate-100 text-slate-800"
                        }`}>
                          {product.isActive ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-2">
                          <Link to={`/admin/products/edit/${product._id}`} className="text-slate-600 hover:text-indigo-600" title="Chỉnh sửa">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="text-slate-600 hover:text-amber-600" title="Nhân bản">
                            <i className="fas fa-clone"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)} 
                            className="text-slate-600 hover:text-rose-600" 
                            title="Xóa"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex flex-wrap justify-between items-center p-6 border-t">
            <div className="text-sm text-slate-600 mb-4 sm:mb-0">
              Hiển thị <span className="font-medium">1-{filteredProducts.length}</span> trong tổng số <span className="font-medium">{products.length}</span> sản phẩm
            </div>
            {filteredProducts.length > 0 && (
              <div className="flex items-center">
                <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 mr-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <i className="fas fa-chevron-left text-xs"></i>
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-indigo-600 text-white hover:bg-indigo-700 mr-2">1</button>
                <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
            <div className="p-4 border-b">
              <h3 className="text-xl font-medium text-center">Thêm sản phẩm mới</h3>
              <button 
                onClick={closeAddModal} 
                className="absolute right-4 top-4 text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Thông tin cơ bản</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="VD: Laptop Gaming ASUS ROG"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thương hiệu*
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleFormChange}
                        placeholder="VD: ASUS"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục*
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục phụ
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={form.subCategory}
                        onChange={handleFormChange}
                        placeholder="VD: Gaming Laptop"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá cơ bản* (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="basePrice"
                        value={form.basePrice}
                        onChange={handleFormChange}
                        placeholder="VD: 25000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện*
                      </label>
                      <input
                        type="text"
                        name="mainImage"
                        value={form.mainImage}
                        onChange={handleFormChange}
                        placeholder="URL ảnh chính"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Mô tả sản phẩm</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả ngắn
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={form.shortDescription}
                      onChange={handleFormChange}
                      placeholder="VD: Laptop gaming mạnh mẽ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả chi tiết*
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Mô tả chi tiết về sản phẩm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Thẻ (Tags)</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {form.tags.map((tag, index) => (
                      <div key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
                        <span>{tag}</span>
                        <button 
                          type="button" 
                          className="ml-2 text-indigo-500 hover:text-indigo-700"
                          onClick={() => removeTag(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="VD: gaming, laptop, high-performance"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
                    >
                      Thêm thẻ
                    </button>
                  </div>
                </div>

                {/* Variants */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Biến thể sản phẩm</h4>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm flex items-center"
                    >
                      <i className="fas fa-plus mr-1"></i> Thêm biến thể
                    </button>
                  </div>

                  {form.variants.map((variant, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Biến thể {index + 1}</h5>
                        {variantCount > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã SKU*
                          </label>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                            placeholder="VD: ASUS-ROG-001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên biến thể*
                          </label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                            placeholder="VD: ASUS ROG 16GB RAM"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá bán* (VNĐ)
                          </label>
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            placeholder="VD: 25000000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá gốc (VNĐ)
                          </label>
                          <input
                            type="number"
                            value={variant.originalPrice}
                            onChange={(e) => handleVariantChange(index, 'originalPrice', e.target.value)}
                            placeholder="VD: 28000000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tồn kho*
                          </label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                            placeholder="VD: 10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Thuộc tính</h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Màu sắc</label>
                            <input
                              type="text"
                              value={variant.attributes.color}
                              onChange={(e) => handleVariantAttributeChange(index, 'color', e.target.value)}
                              placeholder="VD: Black"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">RAM</label>
                            <input
                              type="text"
                              value={variant.attributes.ram}
                              onChange={(e) => handleVariantAttributeChange(index, 'ram', e.target.value)}
                              placeholder="VD: 16GB"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bộ nhớ</label>
                            <input
                              type="text"
                              value={variant.attributes.storage}
                              onChange={(e) => handleVariantAttributeChange(index, 'storage', e.target.value)}
                              placeholder="VD: 512GB SSD"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">Thông số kỹ thuật</h4>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm flex items-center"
                    >
                      <i className="fas fa-plus mr-1"></i> Thêm thông số
                    </button>
                  </div>

                  {form.specifications.map((spec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">Thông số {index + 1}</h5>
                        {specCount > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nhóm thông số*
                          </label>
                          <input
                            type="text"
                            value={spec.category}
                            onChange={(e) => handleSpecChange(index, 'category', e.target.value)}
                            placeholder="VD: CPU"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên thông số*
                          </label>
                          <input
                            type="text"
                            value={spec.name}
                            onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                            placeholder="VD: Processor"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá trị*
                          </label>
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                            placeholder="VD: Intel Core i7-12700H"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đơn vị
                          </label>
                          <input
                            type="text"
                            value={spec.unit}
                            onChange={(e) => handleSpecChange(index, 'unit', e.target.value)}
                            placeholder="VD: GHz"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={spec.isHighlighted}
                            onChange={(e) => handleSpecChange(index, 'isHighlighted', e.target.checked.toString())}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Đánh dấu là thông số nổi bật</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Thêm sản phẩm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManagementPage;
