const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data for categories
const testCategories = [
  {
    name: "Electronics",
    description: "Các sản phẩm điện tử và công nghệ",
    image: "https://example.com/images/electronics.jpg",
    sortOrder: 1,
    metaTitle: "Electronics - Best Deals",
    metaDescription: "Find the best electronics deals",
    keywords: ["electronics", "gadgets", "tech"]
  },
  {
    name: "Computers",
    description: "Máy tính và thiết bị máy tính",
    image: "https://example.com/images/computers.jpg",
    sortOrder: 1,
    metaTitle: "Computers - Laptops, Desktops & Accessories",
    metaDescription: "High-quality computers, laptops, desktops and accessories",
    keywords: ["computers", "laptops", "desktops", "pc"]
  },
  {
    name: "Gaming Laptop",
    description: "Laptop gaming hiệu năng cao",
    image: "https://example.com/images/gaming-laptop.jpg",
    sortOrder: 1,
    metaTitle: "Gaming Laptops - High Performance Gaming",
    metaDescription: "Best gaming laptops with high performance graphics and processors",
    keywords: ["gaming", "laptop", "gaming laptop", "rtx", "gaming pc"]
  }
];

let createdCategoryIds = [];

async function testGetCategories() {
  try {
    console.log('Testing get categories...');
    
    const response = await axios.get(`${API_BASE_URL}/categories`);
    
    console.log('✅ Categories retrieved successfully!');
    console.log('Total categories:', response.data.data.length);
    console.log('First category:', JSON.stringify(response.data.data[0], null, 2));
    
  } catch (error) {
    console.error('❌ Error getting categories:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testGetCategoryTree() {
  try {
    console.log('\nTesting get category tree...');
    
    const response = await axios.get(`${API_BASE_URL}/categories/tree`);
    
    console.log('✅ Category tree retrieved successfully!');
    console.log('Tree structure:', JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error getting category tree:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testCreateCategory(categoryData) {
  try {
    console.log(`\nTesting create category: ${categoryData.name}`);
    
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ Category created successfully!');
    console.log('Created category:', JSON.stringify(response.data.data, null, 2));
    
    // Store the created category ID for later use
    createdCategoryIds.push(response.data.data._id);
    
    return response.data.data._id;
    
  } catch (error) {
    console.error('❌ Error creating category:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

async function testUpdateCategory(categoryId, updateData) {
  try {
    console.log(`\nTesting update category: ${categoryId}`);
    
    const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ Category updated successfully!');
    console.log('Updated category:', JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error updating category:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testGetCategoryBySlug(slug) {
  try {
    console.log(`\nTesting get category by slug: ${slug}`);
    
    const response = await axios.get(`${API_BASE_URL}/categories/slug/${slug}`);
    
    console.log('✅ Category by slug retrieved successfully!');
    console.log('Category:', JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error getting category by slug:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testGetCategoryStats() {
  try {
    console.log('\nTesting get category stats...');
    
    const response = await axios.get(`${API_BASE_URL}/categories/stats`);
    
    console.log('✅ Category stats retrieved successfully!');
    console.log('Stats:', JSON.stringify(response.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error getting category stats:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testDeleteCategory(categoryId) {
  try {
    console.log(`\nTesting delete category: ${categoryId}`);
    
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ Category deleted successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error deleting category:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function runCategoryTests() {
  console.log('🚀 Starting Category API tests...\n');
  
  // Test public endpoints
  await testGetCategories();
  await testGetCategoryTree();
  await testGetCategoryStats();
  
  // Test creating categories
  for (const categoryData of testCategories) {
    await testCreateCategory(categoryData);
  }
  
  // Test getting category by slug
  await testGetCategoryBySlug('electronics');
  
  // Test updating a category
  if (createdCategoryIds.length > 0) {
    await testUpdateCategory(createdCategoryIds[0], {
      description: 'Updated description for Electronics category',
      sortOrder: 5
    });
  }
  
  // Test deleting categories (cleanup)
  // Uncomment the following lines if you want to test deletion
  // for (const categoryId of createdCategoryIds) {
  //   await testDeleteCategory(categoryId);
  // }
  
  console.log('\n✨ Category API tests completed!');
  console.log('Note: To test admin endpoints, replace YOUR_JWT_TOKEN_HERE with a valid admin JWT token');
}

// Run tests
runCategoryTests(); 