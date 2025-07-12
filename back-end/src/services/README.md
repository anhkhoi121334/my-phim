# Services

Thư mục này chứa các service layer, tách biệt logic nghiệp vụ khỏi controllers.

## Mục đích

- Tách logic nghiệp vụ khỏi controllers để dễ dàng bảo trì và test
- Tái sử dụng logic nghiệp vụ giữa các controllers khác nhau
- Giảm kích thước và độ phức tạp của controllers
- Tuân thủ nguyên tắc Single Responsibility Principle

## Cấu trúc

Mỗi service tương ứng với một domain (model) trong ứng dụng:

- `authService.ts`: Xử lý logic đăng nhập, đăng ký, xác thực
- `productService.ts`: Xử lý logic liên quan đến sản phẩm
- `categoryService.ts`: Xử lý logic liên quan đến danh mục
- `orderService.ts`: Xử lý logic liên quan đến đơn hàng
- `userService.ts`: Xử lý logic liên quan đến người dùng
- `couponService.ts`: Xử lý logic liên quan đến mã giảm giá
- `paymentService.ts`: Xử lý logic liên quan đến thanh toán
- `bannerService.ts`: Xử lý logic liên quan đến banner

## Cách sử dụng

```typescript
// Trong controller
import { productService } from '../services';

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}; 