# Validators

Thư mục này chứa các validators để kiểm tra và xác thực dữ liệu đầu vào từ các request.

## Mục đích

- Tách biệt logic xác thực dữ liệu khỏi controllers
- Đảm bảo tính nhất quán trong việc xác thực dữ liệu
- Giảm mã lặp lại trong controllers
- Dễ dàng bảo trì và mở rộng các quy tắc xác thực

## Cấu trúc

Mỗi file validator tương ứng với một domain (model) trong ứng dụng:

- `authValidator.ts`: Xác thực dữ liệu đăng nhập, đăng ký
- `productValidator.ts`: Xác thực dữ liệu sản phẩm
- `categoryValidator.ts`: Xác thực dữ liệu danh mục
- `orderValidator.ts`: Xác thực dữ liệu đơn hàng
- `userValidator.ts`: Xác thực dữ liệu người dùng
- `couponValidator.ts`: Xác thực dữ liệu mã giảm giá
- `paymentValidator.ts`: Xác thực dữ liệu thanh toán
- `bannerValidator.ts`: Xác thực dữ liệu banner

## Cách sử dụng

Sử dụng express-validator để xác thực dữ liệu:

```typescript
// Trong file validators/productValidator.ts
import { body, param, query } from 'express-validator';
import { validate } from './validate';

export const createProductValidator = [
  body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
  body('description').notEmpty().withMessage('Mô tả sản phẩm là bắt buộc'),
  body('price').isNumeric().withMessage('Giá phải là số'),
  validate // Middleware chung để xử lý kết quả validation
];

// Trong file routes/products.ts
import { createProductValidator } from '../validators/productValidator';

router.post('/', createProductValidator, productController.createProduct);
``` 