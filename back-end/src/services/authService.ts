/**
 * Service xử lý logic nghiệp vụ liên quan đến xác thực và người dùng
 */
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticationError, NotFoundError, ValidationError } from '../utils/errorResponse';
import { Types } from 'mongoose';

/**
 * Tạo JWT Token
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  } as jwt.SignOptions);
};

/**
 * Đăng ký người dùng mới
 */
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const { name, email, password } = userData;

  // Kiểm tra email đã tồn tại
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ValidationError('Email đã được sử dụng');
  }

  // Tạo người dùng mới
  const user = await User.create({
    name,
    email,
    password
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id)
  };
};

/**
 * Đăng nhập người dùng
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  const { email, password } = credentials;

  // Kiểm tra email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AuthenticationError('Email hoặc mật khẩu không đúng');
  }

  // Kiểm tra mật khẩu
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Email hoặc mật khẩu không đúng');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id)
  };
};

/**
 * Lấy thông tin người dùng hiện tại
 */
export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  return user;
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUserProfile = async (userId: string, profileData: { name?: string; phone?: string }) => {
  const { name, phone } = profileData;
  
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Cập nhật thông tin
  if (name) user.name = name;
  if (phone) user.phone = phone;
  
  await user.save();
  return user;
};

/**
 * Cập nhật avatar người dùng
 */
export const updateUserAvatar = async (userId: string, avatar: string) => {
  if (!avatar) {
    throw new ValidationError('Vui lòng cung cấp URL hoặc dữ liệu ảnh đại diện');
  }
  
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Cập nhật avatar
  user.avatar = avatar;
  await user.save();
  return user;
};

/**
 * Cập nhật mật khẩu người dùng
 */
export const updateUserPassword = async (userId: string, passwordData: { currentPassword: string; newPassword: string }) => {
  const { currentPassword, newPassword } = passwordData;
  
  // Tìm người dùng và lấy mật khẩu
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AuthenticationError('Mật khẩu hiện tại không đúng');
  }
  
  // Cập nhật mật khẩu mới
  user.password = newPassword;
  await user.save();
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  };
};

/**
 * Lấy danh sách địa chỉ của người dùng
 */
export const getUserAddresses = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  return user.addresses || [];
};

/**
 * Thêm địa chỉ mới cho người dùng
 */
export const addUserAddress = async (userId: string, addressData: any) => {
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
    name: fullName, // Map fullName to name for interface compatibility
    fullName,
    phone,
    province,
    district,
    ward,
    street,
    address: `${street}, ${ward}, ${district}, ${province}`, // Combine fields for address
    city: province, // Use province as city
    country: 'Việt Nam', // Default country
    isDefault: user.addresses.length === 0 // Nếu là địa chỉ đầu tiên, đặt làm mặc định
  };
  
  user.addresses.push(newAddress);
  
  // Nếu là địa chỉ đầu tiên hoặc được đánh dấu là mặc định
  if (newAddress.isDefault) {
    // Đảm bảo chỉ có một địa chỉ mặc định
    user.addresses.forEach(addr => {
      if (addr._id && addr._id.toString() !== addressId.toString()) {
        addr.isDefault = false;
      }
    });
  }
  
  await user.save();
  return newAddress;
};

/**
 * Cập nhật địa chỉ người dùng
 */
export const updateUserAddress = async (userId: string, addressId: string, addressData: any) => {
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Tìm địa chỉ cần cập nhật
  const addressIndex = user.addresses.findIndex(addr => addr._id && addr._id.toString() === addressId);
  if (addressIndex === -1) {
    throw new NotFoundError('Không tìm thấy địa chỉ');
  }
  
  // Cập nhật thông tin địa chỉ
  const { fullName, phone, province, district, ward, street, isDefault } = addressData;
  
  if (fullName) {
    user.addresses[addressIndex].fullName = fullName;
    user.addresses[addressIndex].name = fullName; // Update name field also
  }
  if (phone) user.addresses[addressIndex].phone = phone;
  if (province) {
    user.addresses[addressIndex].province = province;
    user.addresses[addressIndex].city = province; // Update city field also
  }
  if (district) user.addresses[addressIndex].district = district;
  if (ward) user.addresses[addressIndex].ward = ward;
  if (street) user.addresses[addressIndex].street = street;
  
  // Update address field if component parts change
  if (street || ward || district || province) {
    const currentAddress = user.addresses[addressIndex];
    const streetVal = street || currentAddress.street;
    const wardVal = ward || currentAddress.ward;
    const districtVal = district || currentAddress.district;
    const provinceVal = province || currentAddress.province || currentAddress.city;
    
    user.addresses[addressIndex].address = `${streetVal}, ${wardVal}, ${districtVal}, ${provinceVal}`;
  }
  
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
export const deleteUserAddress = async (userId: string, addressId: string) => {
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Tìm địa chỉ cần xóa
  const addressIndex = user.addresses.findIndex(addr => addr._id && addr._id.toString() === addressId);
  if (addressIndex === -1) {
    throw new NotFoundError('Không tìm thấy địa chỉ');
  }
  
  // Kiểm tra nếu là địa chỉ mặc định
  const isDefault = user.addresses[addressIndex].isDefault;
  
  // Xóa địa chỉ
  user.addresses.splice(addressIndex, 1);
  
  // Nếu là địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên là mặc định
  if (isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  
  await user.save();
  return { success: true, message: 'Xóa địa chỉ thành công' };
};

/**
 * Đặt địa chỉ mặc định
 */
export const setDefaultAddress = async (userId: string, addressId: string) => {
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Tìm địa chỉ cần đặt mặc định
  const addressIndex = user.addresses.findIndex(addr => addr._id && addr._id.toString() === addressId);
  if (addressIndex === -1) {
    throw new NotFoundError('Không tìm thấy địa chỉ');
  }
  
  // Đặt tất cả địa chỉ là không mặc định
  user.addresses.forEach((addr, idx) => {
    addr.isDefault = idx === addressIndex;
  });
  
  await user.save();
  return user.addresses[addressIndex];
};

/**
 * Lấy danh sách yêu thích của người dùng
 */
export const getUserWishlist = async (userId: string) => {
  const user = await User.findById(userId).populate('wishlist');
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  return user.wishlist || [];
};

/**
 * Thêm sản phẩm vào danh sách yêu thích
 */
export const addToWishlist = async (userId: string, productId: string) => {
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Kiểm tra sản phẩm đã có trong danh sách yêu thích chưa
  if (user.wishlist.includes(new Types.ObjectId(productId))) {
    return user.populate('wishlist');
  }
  
  // Thêm sản phẩm vào danh sách yêu thích
  user.wishlist.push(new Types.ObjectId(productId));
  await user.save();
  
  return user.populate('wishlist');
};

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 */
export const removeFromWishlist = async (userId: string, productId: string) => {
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng');
  }
  
  // Xóa sản phẩm khỏi danh sách yêu thích
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();
  
  return user.populate('wishlist');
}; 