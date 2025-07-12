# Hướng dẫn sử dụng Category API

## 1. Test bằng Swagger UI

Truy cập: `http://localhost:5000/api-docs`

### Tạo Category mới:
1. Tìm endpoint `POST /api/categories`
2. Click "Try it out"
3. Copy JSON mẫu từ `examples/category-example.json`
4. Paste vào Request Body
5. Click "Execute"

## 2. Test bằng Script

```bash
# Cài đặt axios nếu chưa có
npm install axios

# Chạy test script
node test-category-simple.js
```

## 3. Test bằng cURL

### Lấy danh sách categories:
```bash
curl -X GET "http://localhost:5000/api/categories"
```

### Lấy category tree:
```bash
curl -X GET "http://localhost:5000/api/categories/tree"
```

### Tạo category mới:
```bash
curl -X POST "http://localhost:5000/api/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Các sản phẩm điện tử và công nghệ",
    "image": "https://example.com/images/electronics.jpg",
    "sortOrder": 1,
    "metaTitle": "Electronics - Best Deals",
    "metaDescription": "Find the best electronics deals",
    "keywords": ["electronics", "gadgets", "tech"]
  }'
```

### Lấy category theo slug:
```bash
curl -X GET "http://localhost:5000/api/categories/slug/electronics"
```

## 4. JSON Examples

### Tạo Category đơn giản:
```json
{
  "name": "Electronics",
  "description": "Các sản phẩm điện tử và công nghệ"
}
```

### Tạo Category đầy đủ:
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

### Tạo Sub-category:
```json
{
  "name": "Computers",
  "description": "Máy tính và thiết bị máy tính",
  "parentId": "ELECTRONICS_CATEGORY_ID",
  "sortOrder": 1
}
```

## 5. Response Examples

### Success Response:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Các sản phẩm điện tử và công nghệ",
    "image": "https://example.com/images/electronics.jpg",
    "parentId": null,
    "level": 0,
    "isActive": true,
    "sortOrder": 1,
    "metaTitle": "Electronics - Best Deals",
    "metaDescription": "Find the best electronics deals",
    "keywords": ["electronics", "gadgets", "tech"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Tên danh mục là bắt buộc"
}
```

## 6. Common Issues

### JSON Parse Error:
- Đảm bảo JSON đúng format
- Kiểm tra dấu ngoặc kép và dấu phẩy
- Sử dụng JSON validator online

### Validation Error:
- Kiểm tra các trường bắt buộc (name)
- Đảm bảo slug unique
- Kiểm tra parentId tồn tại

### Authentication Error:
- Admin endpoints cần JWT token
- Thêm header: `Authorization: Bearer YOUR_TOKEN`

## 7. Testing Checklist

- [ ] Server đang chạy (`npm run dev`)
- [ ] MongoDB connected
- [ ] Swagger UI accessible
- [ ] Test GET endpoints (public)
- [ ] Test POST endpoint (admin)
- [ ] Test validation errors
- [ ] Test authentication errors 