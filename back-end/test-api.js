const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testProduct = {
  name: "Laptop Gaming ASUS ROG Strix G15",
  description: "Laptop gaming hiệu năng cao với thiết kế đẹp mắt, phù hợp cho game thủ và người dùng cần hiệu năng mạnh mẽ.",
  shortDescription: "Laptop gaming mạnh mẽ với hiệu năng cao",
  brand: "ASUS",
  category: "Computers",
  subCategory: "Gaming Laptop",
  mainImage: "https://example.com/images/asus-rog-main.jpg",
  images: [
    "https://example.com/images/asus-rog-1.jpg",
    "https://example.com/images/asus-rog-2.jpg"
  ],
  variants: [
    {
      sku: "ASUS-ROG-G15-001",
      name: "16GB RAM, 512GB SSD, RTX 4060",
      price: 25000000,
      originalPrice: 28000000,
      stock: 15,
      images: ["https://example.com/images/asus-rog-variant1-1.jpg"],
      attributes: {
        color: "Black",
        ram: "16GB",
        storage: "512GB SSD",
        gpu: "RTX 4060"
      },
      weight: 2.3,
      dimensions: {
        length: 35.4,
        width: 24.2,
        height: 2.1
      },
      isActive: true
    }
  ],
  specifications: [
    {
      category: "CPU",
      name: "Processor",
      value: "Intel Core i7-12700H",
      unit: "GHz",
      isHighlighted: true
    },
    {
      category: "RAM",
      name: "Memory",
      value: "16GB",
      unit: "DDR4 3200MHz"
    }
  ],
  basePrice: 25000000,
  tags: ["gaming", "laptop", "high-performance"],
  warranty: "24 tháng chính hãng",
  returnPolicy: "30 ngày đổi trả miễn phí",
  shippingInfo: {
    weight: 2.3,
    dimensions: {
      length: 35.4,
      width: 24.2,
      height: 2.1
    },
    freeShipping: true,
    shippingCost: 0
  },
  seo: {
    metaTitle: "Laptop Gaming ASUS ROG Strix G15 - Hiệu năng cao, giá tốt",
    metaDescription: "Laptop gaming ASUS ROG Strix G15 với CPU Intel Core i7, GPU RTX 4060.",
    keywords: ["laptop gaming", "asus rog", "rtx 4060"]
  }
};

async function testCreateProduct() {
  try {
    console.log('Testing create product...');
    
    const response = await axios.post(`${API_BASE_URL}/products`, testProduct, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ Product created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating product:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testGetProducts() {
  try {
    console.log('\nTesting get products...');
    
    const response = await axios.get(`${API_BASE_URL}/products`);
    
    console.log('✅ Products retrieved successfully!');
    console.log('Total products:', response.data.data.length);
    console.log('First product:', JSON.stringify(response.data.data[0], null, 2));
    
  } catch (error) {
    console.error('❌ Error getting products:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testGetProducts();
  await testCreateProduct();
  
  console.log('\n✨ Tests completed!');
}

// Run tests
runTests(); 