import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API cho ứng dụng thương mại điện tử'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID người dùng tự động tạo'
            },
            name: {
              type: 'string',
              description: 'Tên người dùng'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email người dùng'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mật khẩu người dùng'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Vai trò người dùng'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Trạng thái tài khoản'
            },
            wishlist: {
              type: 'array',
              items: {
                type: 'string',
                description: 'ID sản phẩm'
              },
              description: 'Danh sách sản phẩm yêu thích'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'category'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID sản phẩm tự động tạo'
            },
            name: {
              type: 'string',
              description: 'Tên sản phẩm'
            },
            description: {
              type: 'string',
              description: 'Mô tả sản phẩm'
            },
            price: {
              type: 'number',
              description: 'Giá sản phẩm'
            },
            image: {
              type: 'string',
              description: 'URL hình ảnh sản phẩm'
            },
            brand: {
              type: 'string',
              description: 'Thương hiệu'
            },
            category: {
              type: 'string',
              description: 'ID danh mục sản phẩm'
            },
            countInStock: {
              type: 'number',
              description: 'Số lượng trong kho'
            },
            rating: {
              type: 'number',
              description: 'Đánh giá trung bình'
            },
            numReviews: {
              type: 'number',
              description: 'Số lượng đánh giá'
            },
            isFeatured: {
              type: 'boolean',
              description: 'Sản phẩm nổi bật'
            }
          }
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID danh mục tự động tạo'
            },
            name: {
              type: 'string',
              description: 'Tên danh mục'
            },
            description: {
              type: 'string',
              description: 'Mô tả danh mục'
            },
            image: {
              type: 'string',
              description: 'URL hình ảnh danh mục'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Trạng thái danh mục'
            },
            parentCategory: {
              type: 'string',
              description: 'ID danh mục cha (nếu có)'
            }
          }
        },
        Banner: {
          type: 'object',
          required: ['title', 'imageUrl', 'position'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID banner tự động tạo'
            },
            title: {
              type: 'string',
              maxLength: 100,
              description: 'Tiêu đề banner'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: 'Mô tả banner'
            },
            imageUrl: {
              type: 'string',
              description: 'URL hình ảnh banner'
            },
            linkUrl: {
              type: 'string',
              description: 'URL liên kết khi click vào banner'
            },
            position: {
              type: 'string',
              enum: ['home_main', 'home_secondary', 'category_page', 'product_page', 'sidebar', 'popup'],
              default: 'home_main',
              description: 'Vị trí hiển thị banner'
            },
            order: {
              type: 'number',
              default: 0,
              description: 'Thứ tự hiển thị'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày bắt đầu hiển thị'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày kết thúc hiển thị'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Trạng thái kích hoạt banner'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Thời gian tạo'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Thời gian cập nhật'
            }
          }
        },
        OrderItem: {
          type: 'object',
          required: ['name', 'quantity', 'image', 'price', 'product'],
          properties: {
            name: {
              type: 'string',
              description: 'Tên sản phẩm'
            },
            quantity: {
              type: 'number',
              description: 'Số lượng'
            },
            image: {
              type: 'string',
              description: 'URL hình ảnh sản phẩm'
            },
            price: {
              type: 'number',
              description: 'Giá sản phẩm'
            },
            product: {
              type: 'string',
              description: 'ID sản phẩm'
            }
          }
        },
        ShippingAddress: {
          type: 'object',
          required: ['address', 'city', 'postalCode', 'country'],
          properties: {
            address: {
              type: 'string',
              description: 'Địa chỉ đường phố'
            },
            city: {
              type: 'string',
              description: 'Thành phố'
            },
            postalCode: {
              type: 'string',
              description: 'Mã bưu điện'
            },
            country: {
              type: 'string',
              description: 'Quốc gia'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['user', 'orderItems', 'shippingAddress', 'paymentMethod'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID đơn hàng tự động tạo'
            },
            user: {
              type: 'string',
              description: 'ID người dùng'
            },
            orderItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem'
              },
              description: 'Danh sách sản phẩm trong đơn hàng'
            },
            shippingAddress: {
              $ref: '#/components/schemas/ShippingAddress'
            },
            paymentMethod: {
              type: 'string',
              enum: ['PayPal', 'Stripe', 'Cash on Delivery', 'MoMo'],
              description: 'Phương thức thanh toán'
            },
            paymentResult: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID thanh toán'
                },
                status: {
                  type: 'string',
                  description: 'Trạng thái thanh toán'
                },
                update_time: {
                  type: 'string',
                  description: 'Thời gian cập nhật'
                },
                email_address: {
                  type: 'string',
                  description: 'Email thanh toán'
                },
                method: {
                  type: 'string',
                  description: 'Phương thức thanh toán'
                },
                transaction_id: {
                  type: 'string',
                  description: 'ID giao dịch'
                },
                payment_provider: {
                  type: 'string',
                  description: 'Nhà cung cấp dịch vụ thanh toán'
                }
              },
              description: 'Kết quả thanh toán'
            },
            itemsPrice: {
              type: 'number',
              description: 'Tổng giá trị sản phẩm'
            },
            taxPrice: {
              type: 'number',
              description: 'Thuế'
            },
            shippingPrice: {
              type: 'number',
              description: 'Phí vận chuyển'
            },
            discountAmount: {
              type: 'number',
              description: 'Giảm giá'
            },
            couponCode: {
              type: 'string',
              description: 'Mã giảm giá đã sử dụng'
            },
            totalPrice: {
              type: 'number',
              description: 'Tổng thanh toán'
            },
            isPaid: {
              type: 'boolean',
              description: 'Đã thanh toán chưa'
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              description: 'Thời gian thanh toán'
            },
            isDelivered: {
              type: 'boolean',
              description: 'Đã giao hàng chưa'
            },
            deliveredAt: {
              type: 'string',
              format: 'date-time',
              description: 'Thời gian giao hàng'
            },
            orderCode: {
              type: 'string',
              description: 'Mã đơn hàng độc nhất cho MoMo hoặc cổng thanh toán khác'
            }
          }
        },
        Coupon: {
          type: 'object',
          required: ['code', 'discount', 'expiryDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID mã giảm giá tự động tạo'
            },
            code: {
              type: 'string',
              description: 'Mã giảm giá'
            },
            description: {
              type: 'string',
              description: 'Mô tả mã giảm giá'
            },
            discount: {
              type: 'number',
              description: 'Giá trị giảm giá (phần trăm)'
            },
            isActive: {
              type: 'boolean',
              description: 'Trạng thái kích hoạt'
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày hết hạn'
            },
            minAmount: {
              type: 'number',
              description: 'Giá trị đơn hàng tối thiểu'
            },
            maxAmount: {
              type: 'number',
              description: 'Giảm giá tối đa'
            },
            usageLimit: {
              type: 'number',
              description: 'Giới hạn sử dụng'
            },
            usageCount: {
              type: 'number',
              description: 'Số lần đã sử dụng'
            }
          }
        },
        MomoPayment: {
          type: 'object',
          required: ['orderId'],
          properties: {
            orderId: {
              type: 'string',
              description: 'ID đơn hàng cần thanh toán'
            }
          }
        },
        MomoResponse: {
          type: 'object',
          properties: {
            payUrl: {
              type: 'string',
              description: 'URL thanh toán MoMo'
            },
            orderId: {
              type: 'string',
              description: 'ID đơn hàng'
            },
            orderCode: {
              type: 'string',
              description: 'Mã đơn hàng cho MoMo'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Trạng thái thành công'
            },
            message: {
              type: 'string',
              description: 'Thông báo'
            },
            data: {
              type: 'object',
              description: 'Dữ liệu trả về'
            }
          }
        }
      }
    }
  },
  apis: ['src/routes/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 