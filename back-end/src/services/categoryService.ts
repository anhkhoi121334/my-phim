/**
 * Service xử lý logic nghiệp vụ liên quan đến danh mục sản phẩm
 */
import Category from '../models/Category';
import { ICategoryTree, ICategoryStats } from '../types';
import { NotFoundError, ValidationError } from '../utils/errorResponse';
import mongoose from 'mongoose';

/**
 * Lấy danh sách danh mục theo các tiêu chí lọc
 */
export const getCategories = async (
  page: number = 1,
  limit: number = 10,
  filters: {
    parentId?: string | null,
    isActive?: boolean,
    sortBy?: string,
    sortOrder?: string
  } = {}
) => {
  const { parentId, isActive, sortBy = 'sortOrder', sortOrder = 'asc' } = filters;
  
  const query: any = {};
  
  if (parentId !== undefined) {
    query.parentId = parentId === 'null' ? null : parentId;
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const categories = await Category.find(query)
    .populate('parentId', 'name slug')
    .populate('subcategories', 'name slug isActive')
    .sort(sortOptions)
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();

  const total = await Category.countDocuments(query);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Xây dựng cấu trúc cây danh mục
 */
export const getCategoryTree = async () => {
  const categories = await Category.find({ isActive: true })
    .populate('subcategories', 'name slug isActive sortOrder')
    .sort({ sortOrder: 1 })
    .lean();

  // Xây dựng cấu trúc cây
  const buildTree = (items: any[], parentId: string | null = null): ICategoryTree[] => {
    return items
      .filter(item => {
        const itemParentId = item.parentId?._id?.toString() || item.parentId?.toString() || null;
        const parentIdStr = parentId?.toString() || null;
        return itemParentId === parentIdStr;
      })
      .map(item => ({
        ...item,
        children: buildTree(items, item._id.toString())
      }));
  };

  return buildTree(categories);
};

/**
 * Lấy thông tin chi tiết của một danh mục theo ID
 */
export const getCategoryById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('ID danh mục không hợp lệ');
  }

  const category = await Category.findById(id)
    .populate('parentId', 'name slug')
    .populate('subcategories', 'name slug isActive')
    .lean();

  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục');
  }

  return category;
};

/**
 * Lấy thông tin chi tiết của một danh mục theo slug
 */
export const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({ slug, isActive: true })
    .populate('parentId', 'name slug')
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      select: 'name slug image',
      options: { sort: { sortOrder: 1 } }
    })
    .lean();

  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục');
  }

  // Lấy danh sách danh mục cùng cấp
  const siblingCategories = await Category.find({
    parentId: category.parentId || null,
    _id: { $ne: category._id },
    isActive: true
  })
    .select('name slug image')
    .sort({ sortOrder: 1 })
    .lean();

  // Lấy đường dẫn phân cấp (breadcrumbs)
  const breadcrumbs = [];
  
  if (category.parentId) {
    let currentCategory = await Category.findById(category.parentId).lean();
    
    while (currentCategory) {
      breadcrumbs.unshift({
        _id: currentCategory._id,
        name: currentCategory.name,
        slug: currentCategory.slug
      });
      
      if (currentCategory.parentId) {
        currentCategory = await Category.findById(currentCategory.parentId).lean();
      } else {
        currentCategory = null;
      }
    }
  }

  return {
    ...category,
    siblings: siblingCategories,
    breadcrumbs
  };
};

/**
 * Tạo danh mục mới
 */
export const createCategory = async (categoryData: any) => {
  const { 
    name, 
    description, 
    parentId, 
    image, 
    icon, 
    banner,
    metaTitle, 
    metaDescription, 
    isActive = true,
    isFeature = false,
    sortOrder = 0
  } = categoryData;

  // Kiểm tra dữ liệu đầu vào
  if (!name) {
    throw new ValidationError('Tên danh mục là bắt buộc');
  }

  // Kiểm tra danh mục cha nếu có
  if (parentId && parentId !== 'null') {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new ValidationError('ID danh mục cha không hợp lệ');
    }

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      throw new NotFoundError('Không tìm thấy danh mục cha');
    }
  }

  // Tạo slug từ tên danh mục
  const slug = name
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  // Kiểm tra slug đã tồn tại chưa
  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    throw new ValidationError('Tên danh mục đã tồn tại');
  }

  // Tạo danh mục mới
  const newCategory = await Category.create({
    name,
    slug,
    description: description || '',
    parentId: parentId && parentId !== 'null' ? parentId : null,
    image: image || '',
    icon: icon || '',
    banner: banner || '',
    metaTitle: metaTitle || name,
    metaDescription: metaDescription || description || '',
    isActive,
    isFeature,
    sortOrder
  });

  // Cập nhật danh sách subcategories của danh mục cha
  if (parentId && parentId !== 'null') {
    await Category.findByIdAndUpdate(
      parentId,
      { $push: { subcategories: newCategory._id } }
    );
  }

  return newCategory;
};

/**
 * Cập nhật thông tin danh mục
 */
export const updateCategory = async (id: string, categoryData: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('ID danh mục không hợp lệ');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục');
  }

  const { 
    name, 
    description, 
    parentId, 
    image, 
    icon, 
    banner,
    metaTitle, 
    metaDescription, 
    isActive,
    isFeature,
    sortOrder
  } = categoryData;

  // Kiểm tra danh mục cha mới nếu có
  let newParentId = parentId;
  
  if (parentId && parentId !== 'null' && parentId !== category.parentId?.toString()) {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new ValidationError('ID danh mục cha không hợp lệ');
    }

    // Kiểm tra xem danh mục cha mới có tồn tại không
    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      throw new NotFoundError('Không tìm thấy danh mục cha');
    }

    // Kiểm tra xem danh mục cha mới có phải là con của danh mục hiện tại không
    if (parentId === id || (category.subcategories?.includes(parentId))) {
      throw new ValidationError('Không thể chọn danh mục con làm danh mục cha');
    }
  } else if (parentId === 'null') {
    newParentId = null;
  }

  // Cập nhật slug nếu tên thay đổi
  let slug = category.slug;
  if (name && name !== category.name) {
    slug = name
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
    if (existingCategory) {
      throw new ValidationError('Tên danh mục đã tồn tại');
    }
  }

  // Xử lý thay đổi danh mục cha
  const oldParentId = category.parentId?.toString();
  
  if (newParentId !== oldParentId) {
    // Xóa khỏi danh sách subcategories của danh mục cha cũ
    if (oldParentId) {
      await Category.findByIdAndUpdate(
        oldParentId,
        { $pull: { subcategories: id } }
      );
    }
    
    // Thêm vào danh sách subcategories của danh mục cha mới
    if (newParentId) {
      await Category.findByIdAndUpdate(
        newParentId,
        { $push: { subcategories: id } }
      );
    }
  }

  // Cập nhật thông tin danh mục
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name: name || category.name,
      slug,
      description: description !== undefined ? description : category.description,
      parentId: newParentId,
      image: image !== undefined ? image : category.image,
      icon: icon !== undefined ? icon : category.icon,
      banner: banner !== undefined ? banner : category.banner,
      metaTitle: metaTitle !== undefined ? metaTitle : category.metaTitle,
      metaDescription: metaDescription !== undefined ? metaDescription : category.metaDescription,
      isActive: isActive !== undefined ? isActive : category.isActive,
      isFeature: isFeature !== undefined ? isFeature : category.isFeature,
      sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder
    },
    { new: true }
  )
    .populate('parentId', 'name slug')
    .populate('subcategories', 'name slug isActive');

  return updatedCategory;
};

/**
 * Xóa danh mục
 */
export const deleteCategory = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('ID danh mục không hợp lệ');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục');
  }

  // Kiểm tra xem danh mục có danh mục con không
  if ((category.subcategories?.length ?? 0) > 0) {
    throw new ValidationError('Không thể xóa danh mục có chứa danh mục con');
  }

  // Xóa khỏi danh sách subcategories của danh mục cha
  if (category.parentId) {
    await Category.findByIdAndUpdate(
      category.parentId,
      { $pull: { subcategories: id } }
    );
  }

  // Xóa danh mục
  await Category.findByIdAndDelete(id);

  return { message: 'Xóa danh mục thành công' };
};

/**
 * Lấy thống kê về danh mục
 */
export const getCategoryStats = async () => {
  const totalCategories = await Category.countDocuments();
  const activeCategories = await Category.countDocuments({ isActive: true });
  const inactiveCategories = await Category.countDocuments({ isActive: false });
  const parentCategories = await Category.countDocuments({ parentId: null });
  const featuredCategories = await Category.countDocuments({ isFeature: true });

  const stats: ICategoryStats = {
    total: totalCategories,
    active: activeCategories,
    inactive: inactiveCategories,
    parent: parentCategories,
    featured: featuredCategories
  };

  return stats;
};

/**
 * Xóa tất cả danh mục (chỉ dùng cho mục đích phát triển)
 */
export const deleteAllCategories = async () => {
  await Category.deleteMany({});
  return { message: 'Đã xóa tất cả danh mục' };
}; 