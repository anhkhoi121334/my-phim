const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data - đơn giản hơn, không cần slug
const testCategory = {
  name: "Electronics",
  description: "Các sản phẩm điện tử và công nghệ"
};

const testCategoryFull = {
  name: "Computers",
  description: "Máy tính và thiết bị máy tính",
  image: "https://example.com/images/computers.jpg",
  sortOrder: 1,
  metaTitle: "Computers - Laptops & Desktops",
  metaDescription: "High-quality computers and accessories",
  keywords: ["computers", "laptops", "desktops", "pc"]
};

async function testGetCategories() {
  try {
    console.log('🔍 Testing GET /api/categories...');
    
    const response = await axios.get(`${API_BASE_URL}/categories`);
    
    console.log('✅ Success!');
    console.log('Total categories:', response.data.data.length);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testGetCategoryTree() {
  try {
    console.log('\n🌳 Testing GET /api/categories/tree...');
    
    const response = await axios.get(`${API_BASE_URL}/categories/tree`);
    
    console.log('✅ Success!');
    console.log('Tree structure:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testGetCategoryStats() {
  try {
    console.log('\n📊 Testing GET /api/categories/stats...');
    
    const response = await axios.get(`${API_BASE_URL}/categories/stats`);
    
    console.log('✅ Success!');
    console.log('Stats:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testCreateCategory(categoryData, description) {
  try {
    console.log(`\n➕ Testing POST /api/categories (${description})...`);
    console.log('Request data:', JSON.stringify(categoryData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Success!');
    console.log('Created category:', JSON.stringify(response.data, null, 2));
    
    return response.data.data._id;
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return null;
  }
}

async function testGetCategoryBySlug() {
  try {
    console.log('\n🔗 Testing GET /api/categories/slug/electronics...');
    
    const response = await axios.get(`${API_BASE_URL}/categories/slug/electronics`);
    
    console.log('✅ Success!');
    console.log('Category by slug:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Category API Tests...\n');
  
  // Test public endpoints first
  await testGetCategories();
  await testGetCategoryTree();
  await testGetCategoryStats();
  
  // Test creating categories
  console.log('\n📝 Testing Category Creation...');
  await testCreateCategory(testCategory, 'Simple category');
  await testCreateCategory(testCategoryFull, 'Full category');
  
  // Test getting by slug
  await testGetCategoryBySlug();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Slug is now auto-generated from name');
  console.log('- Only "name" field is required');
  console.log('- Admin endpoints (POST, PUT, DELETE) require JWT token');
  console.log('- To test admin endpoints, add Authorization header with Bearer token');
}

// Run tests
runTests(); 