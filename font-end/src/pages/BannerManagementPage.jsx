import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faToggleOn,
  faToggleOff,
  faArrowUp,
  faArrowDown,
  faImages,
  faLink,
  faCalendarAlt,
  faInfoCircle,
  faFilter,
  faRotateRight,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminLayout from '../components/layout/AdminLayout';
import { bannersAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Sortable Banner Row Component
const SortableBannerRow = ({ banner, index, onEdit, onDelete, onToggleStatus }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: banner._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const positionOptions = [
    { value: 'home_main', label: 'Trang chủ - Chính' },
    { value: 'home_secondary', label: 'Trang chủ - Phụ' },
    { value: 'category_page', label: 'Trang danh mục' },
    { value: 'product_page', label: 'Trang sản phẩm' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'popup', label: 'Popup' }
  ];

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="hover:bg-gray-50 transition-colors cursor-move"
    >
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {banner.order !== undefined ? banner.order + 1 : index + 1}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{banner.title}</span>
          {banner.linkUrl && (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-1 flex items-center"
            >
              <FontAwesomeIcon icon={faLink} className="mr-1" />
              {banner.linkUrl.length > 30
                ? banner.linkUrl.substring(0, 30) + '...'
                : banner.linkUrl}
            </a>
          )}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {positionOptions.find(option => option.value === banner.position)?.label || banner.position}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-col">
          {banner.startDate && (
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-green-500" />
              {new Date(banner.startDate).toLocaleDateString()}
            </span>
          )}
          {banner.endDate && (
            <span className="mt-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-red-500" />
              {new Date(banner.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(banner._id)}
          className={`px-3 py-1 rounded-full text-white text-xs flex items-center ${
            banner.isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          <FontAwesomeIcon
            icon={banner.isActive ? faToggleOn : faToggleOff}
            className="mr-1"
          />
          {banner.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
        </button>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(banner)}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          onClick={() => onDelete(banner._id)}
          className="text-red-600 hover:text-red-900"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

const BannerManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'home_main',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [filter, setFilter] = useState({
    position: '',
    active: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch banners
  const { data: bannersData, isLoading, isError } = useQuery(
    ['banners', filter],
    () => bannersAPI.getBanners(filter),
    {
      keepPreviousData: true
    }
  );

  const banners = bannersData?.data || [];

  // Mutations
  const createMutation = useMutation(bannersAPI.createBanner, {
    onSuccess: () => {
      queryClient.invalidateQueries('banners');
      toast.success('Banner đã được tạo thành công');
      closeModal();
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error?.message || error?.response?.data?.message || 'Đã có lỗi xảy ra'}`);
    }
  });

  const updateMutation = useMutation(
    ({ id, formData }) => bannersAPI.updateBanner(id, formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('banners');
        toast.success('Banner đã được cập nhật thành công');
        closeModal();
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error?.message || error?.response?.data?.message || 'Đã có lỗi xảy ra'}`);
      }
    }
  );

  const deleteMutation = useMutation(bannersAPI.deleteBanner, {
    onSuccess: () => {
      queryClient.invalidateQueries('banners');
      toast.success('Banner đã được xóa thành công');
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error?.message || error?.response?.data?.message || 'Đã có lỗi xảy ra'}`);
    }
  });

  const toggleStatusMutation = useMutation(bannersAPI.toggleBannerStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('banners');
      toast.success('Đã thay đổi trạng thái banner');
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error?.message || error?.response?.data?.message || 'Đã có lỗi xảy ra'}`);
    }
  });

  const reorderMutation = useMutation(bannersAPI.reorderBanners, {
    onSuccess: () => {
      queryClient.invalidateQueries('banners');
      toast.success('Đã cập nhật thứ tự banner');
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error?.message || error?.response?.data?.message || 'Đã có lỗi xảy ra'}`);
    }
  });

  // Mutation tạo banner random
  const createRandomBannerMutation = useMutation(
    async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/banners/random`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (!response.ok) throw new Error('Lỗi khi tạo banner random');
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('banners');
        toast.success('Tạo banner random thành công!');
      },
      onError: (error) => {
        toast.error(`Lỗi khi tạo banner random: ${error?.message || 'Đã có lỗi xảy ra'}`);
      }
    }
  );

  // Handle drag and drop reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = banners.findIndex(banner => banner._id === active.id);
    const newIndex = banners.findIndex(banner => banner._id === over.id);

    const newBanners = arrayMove(banners, oldIndex, newIndex);
    
    // Update order property
    const updatedItems = newBanners.map((item, index) => ({
      _id: item._id,
      order: index
    }));
    
    reorderMutation.mutate(updatedItems);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentBanner) {
      updateMutation.mutate({
        id: currentBanner._id,
        formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open modal for creating/editing
  const openModal = (banner = null) => {
    if (banner) {
      setCurrentBanner(banner);
      setFormData({
        title: banner.title,
        description: banner.description || '',
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl || '',
        position: banner.position,
        startDate: banner.startDate ? format(new Date(banner.startDate), 'yyyy-MM-dd') : '',
        endDate: banner.endDate ? format(new Date(banner.endDate), 'yyyy-MM-dd') : '',
        isActive: banner.isActive
      });
    } else {
      setCurrentBanner(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        position: 'home_main',
        startDate: '',
        endDate: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBanner(null);
  };

  // Handle banner deletion
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      deleteMutation.mutate(id);
    }
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    toggleStatusMutation.mutate(id);
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value === "" ? undefined : value
    });
  };

  // Position options
  const positionOptions = [
    { value: 'home_main', label: 'Trang chủ - Chính' },
    { value: 'home_secondary', label: 'Trang chủ - Phụ' },
    { value: 'category_page', label: 'Trang danh mục' },
    { value: 'product_page', label: 'Trang sản phẩm' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'popup', label: 'Popup' }
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            <FontAwesomeIcon icon={faImages} className="mr-2 text-indigo-600" />
            Quản lý Banner
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => openModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Thêm banner mới
            </button>
            <button
              onClick={() => createRandomBannerMutation.mutate()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition"
              disabled={createRandomBannerMutation.isLoading}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Tạo banner random
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vị trí
              </label>
              <select
                name="position"
                value={filter.position}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả vị trí</option>
                {positionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="active"
                value={filter.active}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Banners list */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu banner</p>
              <button
                onClick={() => queryClient.invalidateQueries('banners')}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Thử lại
              </button>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Không có banner nào</p>
              <button
                onClick={() => openModal()}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Tạo banner mới
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thứ tự
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hình ảnh
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vị trí
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <SortableContext
                      items={banners.map(banner => banner._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {banners.map((banner, index) => (
                        <SortableBannerRow
                          key={banner._id}
                          banner={banner}
                          index={index}
                          onEdit={openModal}
                          onDelete={handleDelete}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))}
                    </SortableContext>
                  </tbody>
                </table>
              </div>
            </DndContext>
          )}
        </div>
      </div>

      {/* Modal for create/edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {currentBanner ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL hình ảnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Xem trước:</p>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-32 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL liên kết
                  </label>
                  <input
                    type="text"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {positionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {formData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium mr-2 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {(createMutation.isLoading || updateMutation.isLoading) ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    <span>{currentBanner ? 'Cập nhật' : 'Tạo mới'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BannerManagementPage; 