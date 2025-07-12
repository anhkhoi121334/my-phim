import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { categoriesAPI, productsAPI } from '../utils/api';
import { generateRandomCategory, generateRandomSubCategory, generateRandomProduct } from '../utils/randomGenerator';
import AdminLayout from "../components/layout/AdminLayout";

// === Dữ liệu mẫu ===
const categoriesData = [
  {
    id: 'cat1',
    name: 'Điện thoại',
    icon: 'fas fa-mobile-alt',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    subCategoryCount: 8,
    status: 'active',
    featured: true,
    children: [
      { id: 'sub1-1', name: 'Samsung', productCount: 124, status: 'active', featured: false },
      { id: 'sub1-2', name: 'Apple', productCount: 92, status: 'active', featured: true },
      { id: 'sub1-3', name: 'Xiaomi', productCount: 86, status: 'active', featured: false },
    ],
  },
  {
    id: 'cat2',
    name: 'Laptop',
    icon: 'fas fa-laptop',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    subCategoryCount: 5,
    status: 'active',
    featured: true,
    children: [
        { id: 'sub2-1', name: 'Apple', productCount: 56, status: 'active', featured: false },
        { id: 'sub2-2', name: 'Gaming', productCount: 78, status: 'active', featured: true },
    ]
  },
  {
    id: 'cat3',
    name: 'Tablet',
    icon: 'fas fa-tablet-alt',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    subCategoryCount: 4,
    status: 'active',
    featured: false,
    children: [
        { id: 'sub3-1', name: 'iPad', productCount: 42, status: 'active', featured: true },
        { id: 'sub3-2', name: 'Samsung', productCount: 28, status: 'active', featured: false },
    ]
  },
  {
    id: 'cat4',
    name: 'Phụ kiện',
    icon: 'fas fa-headphones',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    subCategoryCount: 12,
    status: 'active',
    featured: true,
    children: [],
  },
  {
    id: 'cat5',
    name: 'Đồng hồ thông minh',
    icon: 'fas fa-clock',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    subCategoryCount: 6,
    status: 'active',
    featured: false,
    children: [],
  },
  {
    id: 'cat6',
    name: 'Thiết bị AR/VR',
    icon: 'fas fa-vr-cardboard',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    subCategoryCount: 2,
    status: 'hidden',
    featured: false,
    children: [],
  },
];


// === Components con ===

const Header = ({ onMobileMenuClick }) => (
    <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-600" onClick={onMobileMenuClick}>
                    <i className="fas fa-bars text-xl"></i>
                </button>
                <div className="relative hidden sm:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <i className="fas fa-search text-slate-400"></i>
                    </span>
                    <input type="text" placeholder="Tìm kiếm danh mục..."
                        className="pl-10 pr-4 py-2.5 w-72 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
                </div>
            </div>
            {/* ... other header items like notifications, profile */}
        </div>
    </header>
);

const CategoryStatCard = ({ title, value, icon, iconBg, iconColor }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                <i className={`${icon} ${iconColor} text-xl`}></i>
            </div>
        </div>
    </div>
);

const CategoryTreeItem = ({ category, level = 0, onEdit, onDelete, onGenerateSubCategory }) => {
    const [isOpen, setIsOpen] = useState(level === 0);
    
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(category);
    };
    
    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(category._id);
    };

    const handleGenerateSubCategory = (e) => {
        e.stopPropagation();
        onGenerateSubCategory(category._id, category.name);
    };
    
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className={`flex items-center justify-between p-4 bg-slate-50 ${isOpen ? 'border-b border-slate-200' : ''}`}>
                <div className="flex items-center">
                    {category.subcategories && category.subcategories.length > 0 && (
                        <button className="mr-3 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                            <i className={`fas ${isOpen ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i>
                        </button>
                    )}
                    <div className={`w-8 h-8 rounded-lg ${category.iconBg || 'bg-indigo-100'} flex items-center justify-center mr-3`}>
                        <i className={`${category.icon || 'fas fa-tags'} ${category.iconColor || 'text-indigo-600'}`}></i>
                    </div>
                    <div>
                        <h3 className="font-medium text-slate-800">{category.name}</h3>
                        <p className="text-xs text-slate-500">{category.subcategories ? category.subcategories.length : 0} danh mục con</p>
                    </div>
                </div>
                    <div className="flex items-center space-x-2">
                    {level === 0 && (
                        <button 
                            className="px-2.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded hover:bg-emerald-200"
                            title="Tạo danh mục con ngẫu nhiên"
                            onClick={handleGenerateSubCategory}
                        >
                            <i className="fas fa-magic mr-1"></i> Con ngẫu nhiên
                        </button>
                    )}
                    <button 
                        className="px-2.5 py-1.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded hover:bg-indigo-200"
                        title="Chỉnh sửa danh mục"
                            onClick={handleEdit}
                        >
                        <i className="fas fa-edit mr-1"></i> Sửa
                        </button>
                        <button 
                        className="px-2.5 py-1.5 bg-rose-100 text-rose-800 text-xs font-medium rounded hover:bg-rose-200"
                        title="Xóa danh mục"
                            onClick={handleDelete}
                        >
                        <i className="fas fa-trash-alt mr-1"></i> Xóa
                        </button>
                </div>
            </div>
            {isOpen && category.subcategories && category.subcategories.length > 0 && (
                <div className="category-children p-4 bg-white">
                    <div className="space-y-3 ml-8">
                        {category.subcategories.map((child, childIndex) => (
                            <CategoryTreeItem 
                                key={child._id || `subcategory-${childIndex}-${child.name}`} 
                                category={child} 
                                level={level + 1} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                                onGenerateSubCategory={onGenerateSubCategory}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SubCategoryTreeItem = ({ category, onEdit, onDelete }) => {
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(category);
    };
    
    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(category._id);
    };
    
    return (
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div className="flex items-center">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center mr-3">
                    <i className={`${category.icon || 'fas fa-tags'} text-indigo-500 text-sm`}></i>
                </div>
                <div>
                    <h4 className="font-medium text-slate-800 text-sm">{category.name}</h4>
                    <p className="text-xs text-slate-500">{category.productCount} sản phẩm</p>
                </div>
            </div>
            <div className="flex items-center">
                {category.status === 'active' && <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full mr-3">Hoạt động</span>}
                {category.featured && <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full mr-3">Nổi bật</span>}
                <div className="flex items-center space-x-2">
                    <button 
                        className="text-slate-600 hover:text-indigo-600" 
                        title="Chỉnh sửa"
                        onClick={handleEdit}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button 
                        className="text-slate-600 hover:text-rose-600" 
                        title="Xóa"
                        onClick={handleDelete}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

const CategoryModal = ({ isOpen, onClose, category = null, parentId = null }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!category;
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        icon: 'fa-tags',
        iconColor: 'indigo',
        description: '',
        isActive: true,
        isFeatured: false,
        image: ''
    });
    const [autoSlug, setAutoSlug] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fill form data when editing
    useEffect(() => {
        if (isEditMode && category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                icon: category.icon || 'fa-tags',
                iconColor: category.iconColor || 'indigo',
                description: category.description || '',
                isActive: category.isActive !== undefined ? category.isActive : true,
                isFeatured: category.isFeatured || false,
                image: category.image || ''
            });
            setAutoSlug(false); // Disable auto slug in edit mode
        } else if (isOpen) {
            // Reset form for new category
            setFormData({
                name: '',
                slug: '',
                icon: 'fa-tags',
                iconColor: 'indigo',
                description: '',
                isActive: true,
                isFeatured: false,
                image: 'https://picsum.photos/400/300' // Default image URL
            });
            setAutoSlug(true);
        }
    }, [isOpen, category, isEditMode]);

    // Auto slug generation
    useEffect(() => {
        if (autoSlug && formData.name) {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .trim();
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.name, autoSlug]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'slug') {
            setAutoSlug(false);
        }
    };

    // Create category mutation
    const createMutation = useMutation(categoriesAPI.createCategory, {
        onSuccess: () => {
            toast.success('Thêm danh mục thành công!');
            queryClient.invalidateQueries('categories');
            onClose();
            setIsSubmitting(false);
        },
        onError: (error) => {
            toast.error(`Lỗi: ${error.toString()}`);
            setIsSubmitting(false);
        },
    });

    // Update category mutation
    const updateMutation = useMutation(
        (data) => categoriesAPI.updateCategory(category._id, data),
        {
            onSuccess: () => {
                toast.success('Cập nhật danh mục thành công!');
                queryClient.invalidateQueries('categories');
                onClose();
                setIsSubmitting(false);
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.toString()}`);
                setIsSubmitting(false);
            },
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (isEditMode) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate({
                ...formData,
                parentId
            });
        }
    };

    // Icons and colors options
    const iconOptions = [
        { value: 'fa-tags', label: 'Tags' },
        { value: 'fa-mobile-alt', label: 'Điện thoại' },
        { value: 'fa-laptop', label: 'Laptop' },
        { value: 'fa-tablet-alt', label: 'Tablet' },
        { value: 'fa-headphones', label: 'Tai nghe' },
        { value: 'fa-tv', label: 'TV' },
        { value: 'fa-camera', label: 'Máy ảnh' },
        { value: 'fa-clock', label: 'Đồng hồ' },
        { value: 'fa-gamepad', label: 'Trò chơi' },
        { value: 'fa-keyboard', label: 'Bàn phím' },
        { value: 'fa-mouse', label: 'Chuột' },
        { value: 'fa-microchip', label: 'Linh kiện' }
    ];

    const colorOptions = [
        { value: 'indigo', label: 'Indigo' },
        { value: 'blue', label: 'Blue' },
        { value: 'emerald', label: 'Emerald' },
        { value: 'green', label: 'Green' },
        { value: 'purple', label: 'Purple' },
        { value: 'rose', label: 'Rose' },
        { value: 'amber', label: 'Amber' },
        { value: 'red', label: 'Red' },
        { value: 'slate', label: 'Slate' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">
                        {isEditMode 
                            ? `Chỉnh sửa danh mục: ${category.name}` 
                            : parentId 
                                ? 'Thêm danh mục con' 
                                : 'Thêm danh mục mới'
                        }
                    </h3>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tên danh mục */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Tên danh mục <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="VD: Điện thoại" 
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            
                            {/* Slug */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Đường dẫn (Slug) <span className="text-rose-500">*</span>
                                </label>
                                <div className="flex flex-col space-y-2">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            name="slug"
                                            value={formData.slug} 
                                            onChange={handleChange} 
                                            placeholder="VD: dien-thoai" 
                                            required 
                                            disabled={autoSlug}
                                            className={`w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${autoSlug ? 'opacity-70' : ''}`}
                                        />
                                        {autoSlug && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Tự động</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="autoSlug" 
                                            checked={autoSlug} 
                                            onChange={() => setAutoSlug(!autoSlug)} 
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="autoSlug" className="ml-2 text-sm text-slate-600">
                                            Tự động tạo slug từ tên danh mục
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                                <div className="relative">
                                    <select 
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-10 pr-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                    >
                                        {iconOptions.map(icon => (
                                            <option key={icon.value} value={icon.value}>{icon.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <i className={`fas ${formData.icon} text-${formData.iconColor}-600`}></i>
                                    </div>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Icon Color */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Màu icon</label>
                                <div className="relative">
                                    <select 
                                        name="iconColor"
                                        value={formData.iconColor}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                    >
                                        {colorOptions.map(color => (
                                            <option key={color.value} value={color.value}>{color.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-10 flex items-center">
                                        <div className={`w-4 h-4 rounded-full bg-${formData.iconColor}-500`}></div>
                                    </div>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mô tả */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Mô tả về danh mục này..."
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            
                            {/* Ảnh danh mục */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Ảnh danh mục
                                </label>
                                <input 
                                    type="text" 
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="URL ảnh (https://...)"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Gợi ý: Sử dụng <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">https://picsum.photos/400/300</span> cho ảnh mẫu
                                </p>
                                {formData.image && (
                                    <div className="mt-2 flex items-center">
                                        <span className="text-xs text-slate-500 mr-2">Xem trước:</span>
                                        <img 
                                            src={formData.image} 
                                            alt={formData.name || "Category preview"} 
                                            className="w-20 h-16 object-cover rounded border border-slate-200"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://picsum.photos/400/300";
                                            }} 
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Trạng thái */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Trạng thái</label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="isActive" 
                                            name="isActive"
                                            checked={formData.isActive} 
                                            onChange={handleChange} 
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="isActive" className="ml-2 text-sm text-slate-600">
                                            Hiển thị danh mục
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Featured */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Nổi bật</label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="isFeatured" 
                                            name="isFeatured"
                                            checked={formData.isFeatured} 
                                            onChange={handleChange} 
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="isFeatured" className="ml-2 text-sm text-slate-600">
                                            Đánh dấu là danh mục nổi bật
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Preview */}
                        <div className="mt-6 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                            <p className="text-sm font-medium text-slate-700 mb-2">Xem trước:</p>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-lg bg-${formData.iconColor}-100 flex items-center justify-center mr-3`}>
                                    <i className={`fas ${formData.icon} text-${formData.iconColor}-600`}></i>
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800">{formData.name || 'Tên danh mục'}</h3>
                                    <div className="flex mt-1">
                                        {formData.isActive ? (
                                            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">Hoạt động</span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">Ẩn</span>
                                        )}
                                        {formData.isFeatured && (
                                            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">Nổi bật</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex flex-wrap justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                                disabled={isSubmitting}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                        {isEditMode ? 'Đang cập nhật...' : 'Đang thêm...'}
                                    </>
                                ) : (
                                    <>
                                        <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                                        {isEditMode ? 'Cập nhật danh mục' : 'Thêm danh mục'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Add Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, categoryName, isDeleting }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center mb-4">
                        <i className="fas fa-exclamation-triangle text-rose-600 text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Xác nhận xóa danh mục</h3>
                    <p className="text-slate-600">
                        Bạn có chắc chắn muốn xóa danh mục <span className="font-medium text-slate-800">{categoryName}</span>?
                    </p>
                    {categoryName && (
                        <p className="mt-2 text-sm text-rose-500">
                            Lưu ý: Tất cả danh mục con và sản phẩm liên quan cũng sẽ bị ảnh hưởng.
                        </p>
                    )}
                </div>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                        disabled={isDeleting}
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-5 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition flex items-center"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-trash-alt mr-2"></i>
                                Xác nhận xóa
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// === Component chính ===
const CategoryManagementPage = () => {
    const location = useLocation();
    const queryClient = useQueryClient();
    const [view, setView] = useState('tree');
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentParentId, setCurrentParentId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [categories, setCategories] = useState(categoriesData);
    const [categoryStats, setCategoryStats] = useState({
        totalCategories: categoriesData.length,
        featuredCategories: categoriesData.filter(c => c.isFeatured).length,
        totalProducts: categoriesData.reduce((total, c) => total + c.subCategoryCount, 0),
        activeCategories: categoriesData.filter(c => c.isActive).length
    });
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const getActivePage = () => {
        if (location.pathname.includes('/categories')) return 'categories';
        if (location.pathname.includes('/products')) return 'products';
        return 'dashboard';
    };

    // Fetch categories from API
    const { 
        data, 
        isLoading, 
        isError, 
        error 
    } = useQuery('categories', categoriesAPI.getCategories);
    
    useEffect(() => {
        setIsLoadingCategories(isLoading);
        if (data) {
            setCategories(data.data.data || []);
            const categoriesData = data.data.data || [];
            setCategoryStats({
                totalCategories: categoriesData.length,
                featuredCategories: categoriesData.filter(c => c.isFeatured).length,
                totalProducts: categoriesData.reduce((total, c) => total + c.productCount, 0),
                activeCategories: categoriesData.filter(c => c.isActive).length
            });
        }
    }, [data, isLoading]);

    // Delete category mutation
    const deleteMutation = useMutation(
        (id) => categoriesAPI.deleteCategory(id),
        {
            onSuccess: () => {
                toast.success('Xóa danh mục thành công!');
                queryClient.invalidateQueries('categories');
                setIsDeleting(false);
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.toString()}`);
                setIsDeleting(false);
            },
        }
    );

    // Handle add category modal
    const handleOpenAddModal = (parentId = null) => {
        setSelectedCategory(null);
        setCurrentParentId(parentId);
        setCategoryModalOpen(true);
    };

    // Handle edit category
    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setCurrentParentId(null);
        setCategoryModalOpen(true);
    };

    // Handle delete category
    const handleDeleteClick = (categoryId) => {
        const category = findCategoryById(categories, categoryId);
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    // Confirm delete category
    const confirmDelete = () => {
        if (categoryToDelete) {
            setIsDeleting(true);
            deleteMutation.mutate(categoryToDelete._id);
        }
    };

    // Helper function to find category by ID
    const findCategoryById = (categories, id) => {
        for (const category of categories) {
            if (category._id === id) {
                return category;
            }
            
            if (category.subcategories && category.subcategories.length > 0) {
                const found = findCategoryById(category.subcategories, id);
                if (found) return found;
            }
        }
        
        return null;
    };

    // Create category mutation
    const createCategoryMutation = useMutation(
        (categoryData) => categoriesAPI.createCategory(categoryData),
        {
            onSuccess: () => {
                toast.success('Danh mục đã được tạo thành công!');
                queryClient.invalidateQueries('categories');
                setCategoryModalOpen(false);
            },
            onError: (error) => {
                toast.error(`Lỗi khi tạo danh mục: ${error.toString()}`);
            },
        }
    );
    
    // Generate random category
    const handleGenerateRandomCategory = () => {
        const newCategory = generateRandomCategory(categories);
        
        // Update placeholder URL to use picsum.photos
        if (newCategory.image && newCategory.image.includes('placeholder')) {
            newCategory.image = "https://picsum.photos/400/300";
        }
        
        // Tạo danh mục mới
        toast.loading('Đang tạo danh mục mới...');
        
        // Gọi API để tạo danh mục
        categoriesAPI.createCategory(newCategory)
            .then(response => {
                toast.dismiss();
                toast.success(`Đã tạo danh mục: ${response.data.data.name}`);
                
                // Làm mới danh sách danh mục
                queryClient.invalidateQueries('categories');
            })
            .catch(err => {
                toast.dismiss();
                toast.error(`Lỗi khi tạo danh mục: ${err.message}`);
            });
    };
    
    // Generate random subcategory for a parent category
    const handleGenerateRandomSubCategory = (parentId, parentName) => {
        const newSubCategory = generateRandomSubCategory(parentId, parentName);
        
        // Update placeholder URL to use picsum.photos
        if (newSubCategory.image && newSubCategory.image.includes('placeholder')) {
            newSubCategory.image = "https://picsum.photos/400/300";
        }
        
        // Tạo danh mục con mới
        toast.loading(`Đang tạo danh mục con cho ${parentName}...`);
        
        // Gọi API để tạo danh mục con
        categoriesAPI.createCategory(newSubCategory)
            .then(response => {
                toast.dismiss();
                toast.success(`Đã tạo danh mục con: ${response.data.data.name}`);
                
                // Làm mới danh sách danh mục
                queryClient.invalidateQueries('categories');
            })
            .catch(err => {
                toast.dismiss();
                toast.error(`Lỗi khi tạo danh mục con: ${err.message}`);
            });
    };
    
    // Generate multiple random categories
    const handleGenerateMultipleCategories = () => {
        const count = window.prompt('Nhập số lượng danh mục ngẫu nhiên muốn tạo (tối đa 5):', '3');
        if (!count) return;
        
        const categoryCount = Math.min(Math.max(1, parseInt(count)), 5);
        
        toast.success(`Đang tạo ${categoryCount} danh mục ngẫu nhiên...`);
        
        // Create a copy of current categories to track what's been added
        let updatedCategories = [...categories];
        
        for (let i = 0; i < categoryCount; i++) {
            setTimeout(() => {
                const randomCategory = generateRandomCategory(updatedCategories);
                
                // Add this new category to our tracking array to avoid duplicates in subsequent iterations
                updatedCategories = [...updatedCategories, {name: randomCategory.name}];
                
                createCategoryMutation.mutate(randomCategory, {
                    onSuccess: (response) => {
                        // After successfully creating the category, generate 1-2 random products for it
                        const newCategoryId = response.data.data._id;
                        const productCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 random products
                        
                        // Create random products for this category
                        for (let j = 0; j < productCount; j++) {
                            setTimeout(() => {
                                const randomProduct = generateRandomProduct(
                                    newCategoryId, 
                                    null, 
                                    response.data.data.name, 
                                    ''
                                );
                                
                                // Use the products API to create a product
                                productsAPI.createProduct(randomProduct)
                                    .catch(err => toast.error(`Lỗi khi tạo sản phẩm: ${err.message}`));
                            }, j * 300); // Stagger the product creation
                        }
                    }
                });
            }, i * 800); // Stagger the category creation
        }
    };

    // Add deleteAllCategories mutation
    const deleteAllCategoriesMutation = useMutation(
        () => categoriesAPI.deleteAllCategories(),
        {
            onSuccess: () => {
                toast.success('Đã xóa tất cả danh mục thành công!');
                queryClient.invalidateQueries('categories');
                queryClient.invalidateQueries('categoryStats');
                setDeleteModalOpen(false);
            },
            onError: (error) => {
                toast.error(`Lỗi khi xóa tất cả danh mục: ${error.message}`);
            }
        }
    );

    // Handle delete all categories
    const handleDeleteAllCategories = () => {
        // Show confirmation dialog
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn XÓA TẤT CẢ danh mục? Hành động này không thể hoàn tác!');
        
        if (confirmDelete) {
            deleteAllCategoriesMutation.mutate();
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý danh mục</h1>
                    <p className="text-slate-600 mt-1">Quản lý tất cả danh mục sản phẩm trong hệ thống</p>
                </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleGenerateRandomCategory}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                            title="Tạo một danh mục ngẫu nhiên"
                        >
                            <i className="fas fa-magic mr-2"></i> 
                            Tạo ngẫu nhiên
                        </button>
                        
                        <button
                            onClick={handleGenerateMultipleCategories}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                            title="Tạo nhiều danh mục ngẫu nhiên"
                        >
                            <i className="fas fa-wand-magic-sparkles mr-2"></i> 
                            Tạo nhiều ngẫu nhiên
                        </button>
                        
                        <button
                            onClick={() => handleOpenAddModal()}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <i className="fas fa-plus mr-2"></i> 
                            Thêm danh mục
                        </button>
                        
                        <button
                            onClick={handleDeleteAllCategories}
                            className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition-colors"
                            title="Xóa tất cả danh mục"
                        >
                            <i className="fas fa-trash-alt mr-2"></i> 
                            Xóa tất cả
                        </button>
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <CategoryStatCard
                        title="Tổng danh mục" 
                        value={categoryStats.totalCategories || 0} 
                        icon="fas fa-tags" 
                        iconBg="bg-indigo-100"
                        iconColor="text-indigo-600"
                    />
                    <CategoryStatCard
                        title="Danh mục nổi bật"
                        value={categoryStats.featuredCategories || 0} 
                        icon="fas fa-star" 
                        iconBg="bg-amber-100"
                        iconColor="text-amber-600"
                    />
                    <CategoryStatCard
                        title="Tổng sản phẩm" 
                        value={categoryStats.totalProducts || 0} 
                        icon="fas fa-box-open" 
                        iconBg="bg-emerald-100"
                        iconColor="text-emerald-600"
                    />
                    <CategoryStatCard
                        title="Danh mục đang hoạt động"
                        value={categoryStats.activeCategories || 0} 
                        icon="fas fa-check-circle" 
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
                    <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Danh sách danh mục</h2>
                        
                        <div className="flex items-center space-x-4">
                            {/* View Switcher */}
                            <div className="bg-slate-100 rounded-lg p-1 flex items-center">
                            <button
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === 'tree' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                                    onClick={() => setView('tree')}
                                >
                                    <i className="fas fa-sitemap mr-1"></i> Cây phân cấp
                                </button>
                                <button 
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                                    onClick={() => setView('list')}
                            >
                                    <i className="fas fa-list mr-1"></i> Danh sách
                            </button>
                        </div>

                            {/* Mobile Menu Toggle */}
                            <button 
                                className="text-slate-600 sm:hidden"
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-ellipsis-v'}`}></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                            {isLoadingCategories ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : isError ? (
                            <div className="p-8 text-center text-rose-600">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error?.message || 'Có lỗi xảy ra khi tải dữ liệu danh mục'}
                                </div>
                            ) : categories.length === 0 ? (
                            <div className="p-8 text-center text-slate-600">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-folder-open text-slate-400 text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-medium text-slate-700 mb-1">Chưa có danh mục nào</h3>
                                <p className="mb-4 text-slate-500">Thêm danh mục mới để phân loại sản phẩm</p>
                                    <button
                                        onClick={() => handleOpenAddModal()}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                                    >
                                    <i className="fas fa-plus mr-2"></i> Thêm danh mục
                                    </button>
                                </div>
                            ) : (
                            <div className={view === 'tree' ? "space-y-4" : "hidden"}>
                                {categories.map((category, index) => (
                                    <CategoryTreeItem
                                        key={category._id || `category-${index}-${category.name}`} 
                                        category={category}
                                        onEdit={handleEditCategory}
                                        onDelete={handleDeleteClick}
                                        onGenerateSubCategory={handleGenerateRandomSubCategory}
                                    />
                                ))}
                            </div>
                            )}
                    </div>
                </div>

                {/* Category Modal */}
                    <CategoryModal
                        isOpen={isCategoryModalOpen}
                        onClose={() => setCategoryModalOpen(false)}
                        category={selectedCategory}
                        parentId={currentParentId}
                    />

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">
                                <i className="fas fa-exclamation-triangle text-amber-500 mr-2"></i>
                                Xác nhận xóa danh mục
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Bạn có chắc chắn muốn xóa danh mục <span className="font-semibold">{categoryToDelete?.name}</span>?
                                {categoryToDelete?.subcategories?.length > 0 && (
                                    <span className="block text-rose-600 mt-2">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        Cảnh báo: Danh mục này có {categoryToDelete.subcategories.length} danh mục con sẽ bị xóa theo!
                                    </span>
                                )}
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button 
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50"
                                    disabled={isDeleting}
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Đang xóa...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-trash-alt mr-2"></i>
                                            Xóa danh mục
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CategoryManagementPage; 