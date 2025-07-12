/**
 * Service xử lý logic nghiệp vụ liên quan đến người dùng
 */
import User from '../models/User';
import { NotFoundError, ValidationError, AuthenticationError } from '../utils/errorResponse';
import { Types } from 'mongoose';

/**
 * Lấy danh sách tất cả người dùng
 */
export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ValidationError('ID người dùng không hợp lệ');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  return user;
};

/**
 * Cập nhật thông tin người dùng (dành cho admin)
 */
export const updateUserByAdmin = async (userId: string, userData: any) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ValidationError('ID người dùng không hợp lệ');
  }

  const { name, email, phone, role } = userData;

  // Tìm user theo ID
  let user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Kiểm tra nếu email đã thay đổi và đã tồn tại cho người dùng khác
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email đã được sử dụng bởi người dùng khác');
    }
  }

  // Cập nhật thông tin
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (role) updateData.role = role;

  // Cập nhật user
  user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return user;
};

/**
 * Cập nhật avatar người dùng (dành cho admin)
 */
export const updateUserAvatar = async (userId: string, avatar: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ValidationError('ID người dùng không hợp lệ');
  }

  if (!avatar) {
    throw new ValidationError('Vui lòng cung cấp URL hoặc dữ liệu ảnh đại diện');
  }

  // Tìm user theo ID
  let user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Cập nhật avatar
  user = await User.findByIdAndUpdate(
    userId,
    { $set: { avatar } },
    { new: true }
  );

  return user;
};

/**
 * Xóa người dùng
 */
export const deleteUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ValidationError('ID người dùng không hợp lệ');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  await user.deleteOne();
  return { message: 'Xóa người dùng thành công' };
};

/**
 * Lấy danh sách địa chỉ của người dùng
 */
export const getUserAddresses = async (userId: string, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập (chỉ admin hoặc chính người dùng đó mới được xem)
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  return user.addresses || [];
};

/**
 * Thêm địa chỉ mới cho người dùng
 */
export const addUserAddress = async (userId: string, addressData: any, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  // Validate dữ liệu đầu vào
  const { fullName, phone, province, district, ward, street } = addressData;
  
  if (!fullName || !phone || !province || !district || !ward || !street) {
    throw new ValidationError('Vui lòng cung cấp đầy đủ thông tin địa chỉ');
  }

  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Tạo ID cho địa chỉ mới
  const addressId = new Types.ObjectId();

  // Thêm địa chỉ mới
  const newAddress = {
    _id: addressId,
    name: fullName,
    address: street,
    city: province,
    country: 'Vietnam',
    fullName,
    phone,
    province,
    district,
    ward,
    street,
    isDefault: user.addresses.length === 0 || addressData.isDefault === true
  };

  // Nếu địa chỉ mới là mặc định, cập nhật tất cả các địa chỉ khác thành không mặc định
  if (newAddress.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(newAddress);
  await user.save();

  return newAddress;
};

/**
 * Cập nhật địa chỉ người dùng
 */
export const updateUserAddress = async (
  userId: string, 
  addressId: string, 
  addressData: any, 
  currentUserId: string, 
  isAdmin: boolean
) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Tìm địa chỉ cần cập nhật
  const addressIndex = user.addresses.findIndex(addr => addr._id?.toString() === addressId);
  if (addressIndex === -1) {
    throw new NotFoundError('Không tìm thấy địa chỉ');
  }

  // Cập nhật thông tin địa chỉ
  const { fullName, phone, province, district, ward, street, isDefault } = addressData;

  if (fullName) user.addresses[addressIndex].fullName = fullName;
  if (phone) user.addresses[addressIndex].phone = phone;
  if (province) user.addresses[addressIndex].province = province;
  if (district) user.addresses[addressIndex].district = district;
  if (ward) user.addresses[addressIndex].ward = ward;
  if (street) user.addresses[addressIndex].street = street;

  // Nếu đánh dấu là địa chỉ mặc định
  if (isDefault === true) {
    user.addresses.forEach((addr, idx) => {
      addr.isDefault = idx === addressIndex;
    });
  }

  await user.save();
  return user.addresses[addressIndex];
};

/**
 * Xóa địa chỉ người dùng
 */
export const deleteUserAddress = async (userId: string, addressId: string, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Tìm địa chỉ cần xóa
  const addressIndex = user.addresses.findIndex(addr => addr._id?.toString() === addressId);
  if (addressIndex === -1) {
    throw new NotFoundError('Không tìm thấy địa chỉ');
  }

  // Kiểm tra nếu là địa chỉ mặc định
  const isDefault = user.addresses[addressIndex].isDefault;

  // Xóa địa chỉ
  user.addresses.splice(addressIndex, 1);

  // Nếu đã xóa địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
  if (isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return { message: 'Xóa địa chỉ thành công' };
};

/**
 * Đặt địa chỉ mặc định cho người dùng
 */
export const setDefaultAddress = async (userId: string, addressId: string, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Tìm địa chỉ cần đặt làm mặc định
  const addressIndex = user.addresses.findIndex(addr => addr._id?.toString() === addressId);
  if (addressIndex === -1) {
    throw new NotFoundError('Không tìm thấy địa chỉ');
  }

  // Đặt tất cả địa chỉ thành không mặc định
  user.addresses.forEach((addr, idx) => {
    addr.isDefault = idx === addressIndex;
  });

  await user.save();
  return user.addresses[addressIndex];
};

/**
 * Lấy danh sách yêu thích của người dùng
 */
export const getUserWishlist = async (userId: string, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  const user = await User.findById(userId).populate({
    path: 'wishlist',
    select: 'name slug mainImage basePrice minPrice maxPrice brand averageRating numReviews'
  });
  
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  return user.wishlist || [];
};

/**
 * Thêm sản phẩm vào danh sách yêu thích
 */
export const addToWishlist = async (userId: string, productId: string, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  if (!productId) {
    throw new ValidationError('Vui lòng cung cấp ID sản phẩm');
  }

  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Kiểm tra xem sản phẩm đã có trong wishlist chưa
  if (user.wishlist && user.wishlist.includes(new Types.ObjectId(productId))) {
    return user.populate({
      path: 'wishlist',
      select: 'name slug mainImage basePrice minPrice maxPrice brand averageRating numReviews'
    });
  }

  // Thêm sản phẩm vào wishlist
  if (!user.wishlist) {
    user.wishlist = [];
  }
  user.wishlist.push(new Types.ObjectId(productId));

  await user.save();

  // Lấy wishlist đã cập nhật với thông tin sản phẩm
  return user.populate({
    path: 'wishlist',
    select: 'name slug mainImage basePrice minPrice maxPrice brand averageRating numReviews'
  });
};

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 */
export const removeFromWishlist = async (userId: string, productId: string, currentUserId: string, isAdmin: boolean) => {
  // Kiểm tra quyền truy cập
  if (!isAdmin && currentUserId !== userId) {
    throw new AuthenticationError('Không có quyền truy cập');
  }

  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }

  // Xóa sản phẩm khỏi wishlist
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);

  await user.save();

  // Lấy wishlist đã cập nhật với thông tin sản phẩm
  return user.populate({
    path: 'wishlist',
    select: 'name slug mainImage basePrice minPrice maxPrice brand averageRating numReviews'
  });
}; 