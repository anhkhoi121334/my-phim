# E-commerce Backend API

Backend API hoàn chỉnh cho hệ thống e-commerce với hỗ trợ biến thể sản phẩm, cấu hình máy móc và quản lý danh mục.

## Tính năng

- ✅ **Authentication & Authorization** với JWT
- ✅ **Product Management** với biến thể và thông số kỹ thuật
- ✅ **Category Management** với cấu trúc phân cấp
- ✅ **Order Management** 
- ✅ **User Management**
- ✅ **Validation** và error handling
- ✅ **Swagger/OpenAPI** documentation
- ✅ **TypeScript** support
- ✅ **MongoDB** database

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chạy development server
npm run dev

# Build production
npm run build
npm start
```

## Cấu hình Environment

Tạo file `.env` với các biến sau:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

## API Documentation

Sau khi chạy server, truy cập Swagger UI tại:
```
http://localhost:5000/api-docs
```

## Cấu trúc Category với Products

### Ví dụ tạo danh mục:

```json
{
  "name": "Electronics",
  "description": "Các sản phẩm điện tử và công nghệ",
  "image": "https://example.com/images/electronics.jpg",
  "sortOrder": 1,
  "metaTitle": "Electronics - Best Deals on Tech Products",
  "metaDescription": "Find the best deals on electronics, gadgets, and tech products",
  "keywords": ["electronics", "gadgets", "tech", "technology"]
}
```

### Ví dụ tạo sản phẩm với category:

```json
{
  "name": "Laptop Gaming ASUS ROG Strix G15",
  "description": "Laptop gaming hiệu năng cao...",
  "brand": "ASUS",
  "category": "507f1f77bcf86cd799439011",
  "subCategory": "507f1f77bcf86cd799439012",
  "mainImage": "https://example.com/images/main.jpg",
  "variants": [
    {
      "sku": "ASUS-ROG-G15-001",
      "name": "16GB RAM, 512GB SSD, RTX 4060",
      "price": 25000000,
      "stock": 15,
      "attributes": {
        "color": "Black",
        "ram": "16GB",
        "storage": "512GB SSD",
        "gpu": "RTX 4060"
      }
    }
  ],
  "specifications": [
    {
      "category": "CPU",
      "name": "Processor",
      "value": "Intel Core i7-12700H",
      "unit": "GHz",
      "isHighlighted": true
    }
  ],
  "basePrice": 25000000
}
```

## Testing API

### 1. Sử dụng Swagger UI
- Truy cập `http://localhost:5000/api-docs`
- Test các endpoints trực tiếp

### 2. Sử dụng test scripts
```bash
# Cài đặt axios nếu chưa có
npm install axios

# Test Product API
node test-api.js

# Test Category API
node test-category-api.js
```

### 3. Sử dụng Postman/Insomnia
Import collection từ file `examples/` và test các endpoints.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/tree` - Lấy cấu trúc cây danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `GET /api/categories/slug/:slug` - Lấy danh mục theo slug
- `GET /api/categories/stats` - Lấy thống kê danh mục
- `POST /api/categories` - Tạo danh mục (Admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

### Users
- `GET /api/users` - Lấy danh sách users (Admin)
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật thông tin user

## Cấu trúc Database

### Category Schema
```typescript
{
  name: String (required),
  slug: String (required, unique),
  description: String,
  image: String,
  parentId: ObjectId (ref: Category),
  level: Number (0: root, 1: child),
  isActive: Boolean,
  sortOrder: Number,
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  subcategories: [Category] (virtual),
  productsCount: Number (virtual)
}
```

### Product Schema
```typescript
{
  name: String (required),
  description: String (required),
  brand: String (required),
  category: ObjectId (ref: Category, required),
  subCategory: ObjectId (ref: Category),
  variants: [{
    sku: String,
    name: String,
    price: Number,
    stock: Number,
    attributes: Object,
    images: [String]
  }],
  specifications: [{
    category: String,
    name: String,
    value: String,
    unit: String,
    isHighlighted: Boolean
  }],
  basePrice: Number,
  minPrice: Number,
  maxPrice: Number
}
```

## Development

### Scripts
```bash
npm run dev          # Development mode với nodemon
npm run build        # Build TypeScript
npm start           # Production mode
npm run lint        # Lint code
npm run test        # Run tests
```

### Project Structure
```
src/
├── config/         # Database, swagger config
├── controllers/    # Route controllers
├── middleware/     # Auth, validation middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Helper functions
└── app.ts          # Express app
```

## Deployment

### Docker
```bash
# Build image
docker build -t ecommerce-api .

# Run container
docker run -p 5000:5000 ecommerce-api
```

### Environment Variables
Đảm bảo set các biến môi trường cho production:
- `NODE_ENV=production`
- `MONGODB_URI` (production database)
- `JWT_SECRET` (strong secret)

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License 