// ===================================================================================
// DATA & CONFIGURATION
// ===================================================================================

/**
 * The single source of truth for all product information.
 * This structure eliminates the need for complex logic to match products, brands, and categories.
 */
const productCatalog = {
  // Điện thoại
  "Samsung Galaxy S24 Ultra": { brand: "Samsung", type: "phone", category: "Điện thoại" },
  "iPhone 15 Pro Max": { brand: "Apple", type: "phone", category: "Điện thoại" },
  "Asus ROG Phone 8": { brand: "Asus", type: "phone", category: "Điện thoại" },
  "Xiaomi 14 Ultra": { brand: "Xiaomi", type: "phone", category: "Điện thoại" },
  "OnePlus 12": { brand: "OnePlus", type: "phone", category: "Điện thoại" },
  "Google Pixel 8 Pro": { brand: "Google", type: "phone", category: "Điện thoại" },
  "Oppo Find X7 Ultra": { brand: "Oppo", type: "phone", category: "Điện thoại" },

  // Laptop
  "Macbook Pro M3": { brand: "Apple", type: "laptop", category: "Laptop" },
  "Dell XPS 15": { brand: "Dell", type: "laptop", category: "Laptop" },
  "Asus ROG Zephyrus G14": { brand: "Asus", type: "laptop", category: "Laptop" },
  "Lenovo ThinkPad X1 Carbon": { brand: "Lenovo", type: "laptop", category: "Laptop" },
  "HP Spectre x360": { brand: "HP", type: "laptop", category: "Laptop" },
  "Microsoft Surface Laptop 6": { brand: "Microsoft", type: "laptop", category: "Laptop" },

  // Máy tính bảng
  "iPad Air M2": { brand: "Apple", type: "tablet", category: "Máy tính bảng" },
  "Samsung Galaxy Tab S9 Ultra": { brand: "Samsung", type: "tablet", category: "Máy tính bảng" },
  "Xiaomi Pad 6": { brand: "Xiaomi", type: "tablet", category: "Máy tính bảng" },
  "Microsoft Surface Pro 9": { brand: "Microsoft", type: "tablet", category: "Máy tính bảng" },
  "OnePlus Pad": { brand: "OnePlus", type: "tablet", category: "Máy tính bảng" },

  // TV
  "LG OLED C3": { brand: "LG", type: "tv", category: "TV" },
  "Samsung Neo QLED QN90C": { brand: "Samsung", type: "tv", category: "TV" },
  "Sony Bravia XR A95L": { brand: "Sony", type: "tv", category: "TV" },
  "Xiaomi TV Q2": { brand: "Xiaomi", type: "tv", category: "TV" },

  // Tai nghe
  "Sony WH-1000XM5": { brand: "Sony", type: "headphone", category: "Tai nghe" },
  "Apple AirPods Pro 2": { brand: "Apple", type: "headphone", category: "Tai nghe" },
  "Bose QuietComfort Ultra": { brand: "Bose", type: "headphone", category: "Tai nghe" },
  "Samsung Galaxy Buds Pro 2": { brand: "Samsung", type: "headphone", category: "Tai nghe" },

  // Máy ảnh
  "Canon EOS R6": { brand: "Canon", type: "camera", category: "Máy ảnh" },
  "Sony Alpha A7 IV": { brand: "Sony", type: "camera", category: "Máy ảnh" },
  "Nikon Z8": { brand: "Nikon", type: "camera", category: "Máy ảnh" },
  
  // Gaming
  "PlayStation 5": { brand: "Sony", type: "gaming", category: "Gaming" },
  "Xbox Series X": { brand: "Microsoft", type: "gaming", category: "Gaming" },
  "Nintendo Switch OLED": { brand: "Nintendo", type: "gaming", category: "Gaming" },
  
  // PC
  "Alienware Aurora R15": { brand: "Dell", type: "pc", category: "PC" },
  "HP Omen 45L": { brand: "HP", type: "pc", category: "PC" },
  "MSI MEG Aegis Ti5": { brand: "MSI", type: "pc", category: "PC" },
  "Lenovo Legion Tower 7i": { brand: "Lenovo", type: "pc", category: "PC" },
  "ASUS ROG Strix G35CA": { brand: "Asus", type: "pc", category: "PC" },
  "Acer Predator Orion 7000": { brand: "Acer", type: "pc", category: "PC" },

  // Sạc dự phòng
  "Anker PowerCore 26800": { brand: "Anker", type: "powerbank", category: "Sạc dự phòng" },
  "Samsung 20000mAh Power Bank": { brand: "Samsung", type: "powerbank", category: "Sạc dự phòng" },
  "Xiaomi Redmi 20000mAh": { brand: "Xiaomi", type: "powerbank", category: "Sạc dự phòng" },
  
  // Phụ kiện
  "Apple MagSafe Charger": { brand: "Apple", type: "accessory", category: "Phụ kiện" },
  "Samsung Wireless Charger": { brand: "Samsung", type: "accessory", category: "Phụ kiện" },
  "Anker Charging Station": { brand: "Anker", type: "accessory", category: "Phụ kiện" },
  "Logitech MX Master 3": { brand: "Logitech", type: "accessory", category: "Phụ kiện" },
  "Belkin Screen Protector": { brand: "Belkin", type: "accessory", category: "Phụ kiện" },

  // Thiết bị nhà thông minh
  "Google Nest Hub": { brand: "Google", type: "smarthome", category: "Thiết bị nhà thông minh" },
  "Amazon Echo Dot": { brand: "Amazon", type: "smarthome", category: "Thiết bị nhà thông minh" },
  "Philips Hue Starter Kit": { brand: "Philips", type: "smarthome", category: "Thiết bị nhà thông minh" },
  "Xiaomi Mi Smart Speaker": { brand: "Xiaomi", type: "smarthome", category: "Thiết bị nhà thông minh" },
  "Apple HomePod Mini": { brand: "Apple", type: "smarthome", category: "Thiết bị nhà thông minh" },
  "Samsung SmartThings Hub": { brand: "Samsung", type: "smarthome", category: "Thiết bị nhà thông minh" },
};

const allProductNames = Object.keys(productCatalog);
const allBrands = [...new Set(Object.values(productCatalog).map(p => p.brand))];

const phoneSpecs = [
  { category: "Màn hình", name: "Công nghệ màn hình", values: ["AMOLED", "Super Retina XDR", "Dynamic AMOLED 2X"] },
  { category: "Màn hình", name: "Kích thước màn hình", values: ["6.1 inch", "6.7 inch", "6.9 inch"] },
  { category: "Camera", name: "Camera chính", values: ["12 MP", "48 MP", "108 MP", "200 MP"] },
  { category: "Hiệu năng", name: "Chip", values: ["Snapdragon 8 Gen 3", "Apple A17 Pro", "Exynos 2400"] },
  { category: "Hiệu năng", name: "RAM", values: ["8 GB", "12 GB", "16 GB"] },
  { category: "Pin & Sạc", name: "Dung lượng pin", values: ["4500 mAh", "5000 mAh", "4323 mAh"] }
];

const laptopSpecs = [
  { category: "CPU", name: "Processor", values: ["Intel Core i7-13700H", "AMD Ryzen 9 7950X", "Apple M3 Pro", "Intel Core i9-14900K"] },
  { category: "GPU", name: "Graphics", values: ["NVIDIA RTX 4060", "NVIDIA RTX 4070", "Apple M3 GPU 18-core"] },
  { category: "Màn hình", name: "Kích thước màn hình", values: ["13.3 inch", "14 inch", "15.6 inch", "16 inch"] },
  { category: "RAM", name: "Bộ nhớ", values: ["8 GB", "16 GB", "32 GB", "64 GB"] },
  { category: "Lưu trữ", name: "SSD", values: ["512 GB", "1 TB", "2 TB", "4 TB"] }
];

const pcSpecs = [
  { category: "CPU", name: "Processor", values: ["Intel Core i9-14900K", "AMD Ryzen 9 7950X3D", "Intel Core i7-14700K", "AMD Ryzen 7 7800X3D"] },
  { category: "GPU", name: "Graphics", values: ["NVIDIA RTX 4090", "NVIDIA RTX 4080 Super", "AMD Radeon RX 7900 XTX", "NVIDIA RTX 4070 Ti Super"] },
  { category: "RAM", name: "Bộ nhớ", values: ["16 GB", "32 GB", "64 GB", "128 GB"] },
  { category: "Lưu trữ", name: "SSD", values: ["1 TB", "2 TB", "4 TB", "8 TB"] },
  { category: "Nguồn", name: "Power Supply", values: ["750W", "850W", "1000W", "1200W"] }
];

const tabletSpecs = [
  { category: "Màn hình", name: "Kích thước", values: ["10.2 inch", "11 inch", "12.9 inch"] },
  { category: "Hiệu năng", name: "Chip", values: ["Apple M2", "Snapdragon 8 Gen 2", "Dimensity 9000"] },
  { category: "Lưu trữ", name: "Bộ nhớ trong", values: ["128 GB", "256 GB", "512 GB", "1 TB"] },
  { category: "Pin", name: "Dung lượng pin", values: ["8000 mAh", "9000 mAh", "10090 mAh"] }
];

const tvSpecs = [
  { category: "Màn hình", name: "Kích thước", values: ["55 inch", "65 inch", "75 inch"] },
  { category: "Màn hình", name: "Độ phân giải", values: ["4K UHD", "8K"] },
  { category: "Màn hình", name: "Công nghệ", values: ["OLED", "QLED", "Mini LED"] }
];

const smartHomeSpecs = [
  { category: "Kết nối", name: "Công nghệ kết nối", values: ["Wi-Fi", "Bluetooth 5.0", "Zigbee", "Thread"] },
  { category: "Tính năng", name: "Trợ lý ảo", values: ["Google Assistant", "Amazon Alexa", "Apple Siri", "Samsung Bixby"] },
  { category: "Tính năng", name: "Tích hợp", values: ["HomeKit", "SmartThings", "Google Home", "Amazon Echo"] },
  { category: "Nguồn", name: "Nguồn điện", values: ["Pin sạc", "Điện trực tiếp", "Pin AA", "Pin lithium"] }
];

// Default specs for other types
const defaultSpecs = [
    { category: "Chung", name: "Bảo hành", values: ["12 tháng", "24 tháng"]},
    { category: "Chung", name: "Xuất xứ", values: ["Trung Quốc", "Việt Nam", "Hàn Quốc", "Mỹ"]},
];


/**
 * A centralized configuration for product pricing tiers.
 * Makes it easy to manage price ranges for different brands and product types.
 */
const priceTiers = {
    // Default prices
    default: {
        phone: { min: 7000000, max: 20000000 },
        laptop: { min: 15000000, max: 35000000 },
        tablet: { min: 8000000, max: 20000000 },
        tv: { min: 12000000, max: 40000000 },
        headphone: { min: 2000000, max: 8000000 },
        camera: { min: 15000000, max: 40000000 },
        gaming: { min: 10000000, max: 15000000 },
        pc: { min: 20000000, max: 50000000 },
        powerbank: { min: 500000, max: 2000000 },
        accessory: { min: 300000, max: 3000000 },
        smarthome: { min: 1000000, max: 5000000 },
        other: { min: 1000000, max: 10000000 },
    },
    // Brand-specific overrides for premium pricing
    Apple: {
        phone: { min: 20000000, max: 45000000 },
        laptop: { min: 28000000, max: 70000000 },
        tablet: { min: 15000000, max: 40000000 },
        headphone: { min: 5000000, max: 15000000 },
        accessory: { min: 500000, max: 5000000 },
        smarthome: { min: 2500000, max: 8000000 },
    },
    Samsung: {
        phone: { min: 18000000, max: 38000000 },
        tv: { min: 20000000, max: 80000000 },
        powerbank: { min: 800000, max: 2500000 },
    },
    Sony: {
        tv: { min: 22000000, max: 75000000 },
        camera: { min: 25000000, max: 60000000 },
        headphone: { min: 7000000, max: 12000000 },
    },
    Anker: {
        powerbank: { min: 700000, max: 2200000 },
        accessory: { min: 400000, max: 2500000 },
    },
    Google: {
        smarthome: { min: 1500000, max: 6000000 },
    },
    Amazon: {
        smarthome: { min: 1200000, max: 4500000 },
    },
    Philips: {
        smarthome: { min: 2000000, max: 7000000 },
    },
};

// ===================================================================================
// UTILITY FUNCTIONS
// ===================================================================================

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateSKU = (brand, type, suffix) => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  const brandPart = brand.substring(0, 3).toUpperCase();
  const typePart = type.substring(0, 3).toUpperCase();
  return `${brandPart}-${typePart}-${random}-${suffix}`;
};

// ===================================================================================
// GENERATOR FUNCTIONS (REFACTORED & SIMPLIFIED)
// ===================================================================================

/**
 * Get appropriate specs based on product type.
 * @param {string} productType
 * @returns {Array}
 */
const getSpecsForProductType = (productType) => {
  switch (productType) {
    case 'phone': return phoneSpecs;
    case 'laptop': return laptopSpecs;
    case 'tablet': return tabletSpecs;
    case 'tv': return tvSpecs;
    case 'pc': return pcSpecs;
    case 'smarthome': return smartHomeSpecs;
    default: return defaultSpecs;
  }
};

/**
 * Generate meaningful placeholder image URLs.
 * @param {string} text - The text to display on the image.
 * @returns {object} - Object with mainImage and images array.
 */
const generateProductImages = (text) => {
  const label = encodeURIComponent(text);
  const mainImage = `https://dummyimage.com/600x600/e0e0e0/5c5c5c.png&text=${label}`;
  const images = [
    `https://dummyimage.com/600x600/e0e0e0/5c5c5c.png&text=${label}+%28view+1%29`,
    `https://dummyimage.com/600x600/e0e0e0/5c5c5c.png&text=${label}+%28view+2%29`,
  ];
  return { mainImage, images };
};

/**
 * Generate a random product that correctly matches the given category.
 * @param {string} categoryId - The category ID.
 * @param {string} subCategoryId - The subcategory ID.
 * @param {string} categoryName - The name of the category (e.g., "Điện thoại").
 * @param {string} subCategoryName - Optional. The name of the subcategory.
 * @returns {Object|null} - A random product object or null if no matching products are found.
 */
export const generateRandomProduct = (categoryId, subCategoryId, categoryName, subCategoryName = '') => {
  if (!categoryId || !categoryName) {
    console.error("Category ID and Name must be provided.");
    return null;
  }

  // 1. Find all products in the catalog that match the given category name.
  const relevantProductNames = allProductNames.filter(
    name => productCatalog[name].category === categoryName
  );

  if (relevantProductNames.length === 0) {
    console.warn(`No products found in catalog for category: "${categoryName}".`);
    return null; // Or handle fallback
  }

  // 2. Select a random product and get its definitive details from the catalog.
  const productName = randomElement(relevantProductNames);
  const { brand, type: productType } = productCatalog[productName];

  // 3. Get the correct price range from the centralized priceTiers config.
  const priceTier = (priceTiers[brand] && priceTiers[brand][productType]) 
                  || (priceTiers.default[productType])
                  || priceTiers.default.other;
  const basePrice = randomInt(priceTier.min, priceTier.max);
  const discountPercent = randomInt(5, 25);
  const originalPrice = Math.round(basePrice / (1 - discountPercent / 100));

  // 4. Generate specifications correctly.
  const specs = getSpecsForProductType(productType);
  const specifications = specs.map(spec => {
    // Correct way to get value and unit without mismatch
    const fullValue = randomElement(spec.values);
    const parts = fullValue.split(' ');
    const value = parts[0];
    const unit = parts.length > 1 ? parts.slice(1).join(' ') : '';
    
    return {
      category: spec.category,
      name: spec.name,
      value: value,
      unit: unit,
      isHighlighted: Math.random() > 0.7,
    };
  });

  // 5. Generate consistent variants.
  const variants = [];
  let totalStock = 0; // Changed from const to let
  const variantOptions = {
    storage: ["128 GB", "256 GB", "512 GB", "1 TB"],
    ram: ["8 GB", "16 GB", "32 GB"],
    colors: ["Đen", "Trắng", "Bạc", "Titan Tự nhiên", "Xanh Dương"],
  };

  for (let i = 0; i < randomInt(1, 3); i++) {
    const variantStorage = randomElement(variantOptions.storage);
    const variantRam = productType === 'laptop' ? randomElement(variantOptions.ram) : '';
    const variantColor = randomElement(variantOptions.colors);
    
    // Create name from attributes to ensure consistency
    const nameParts = [variantStorage, variantRam, variantColor].filter(Boolean);
    const variantName = nameParts.join(' - ');

    // Adjust price based on storage
    let priceModifier = 0;
    if (variantStorage.includes("1 TB")) priceModifier = 5000000;
    else if (variantStorage.includes("512 GB")) priceModifier = 2500000;
    
    const variantPrice = basePrice + priceModifier;
    const variantOriginalPrice = Math.round(variantPrice / (1 - discountPercent / 100));
    const stock = randomInt(5, 50);
    totalStock += stock;

    variants.push({
      sku: generateSKU(brand, productType, i + 1),
      name: variantName,
      price: variantPrice,
      originalPrice: variantOriginalPrice,
      stock: stock,
      attributes: {
        color: variantColor,
        memory: variantStorage,
        ram: variantRam,
      }
    });
  }

  // 6. Create the final product object.
  const productImages = generateProductImages(productName);

  // Generate a main SKU for the product
  const mainSku = generateSKU(brand, productType, '0');

  const product = {
    name: productName,
    description: `Sản phẩm ${productName} chính hãng từ ${brand}. Trải nghiệm công nghệ đỉnh cao và thiết kế sang trọng.`,
    shortDescription: `${productName} - Hàng chính hãng, bảo hành 12 tháng.`,
    brand,
    category: categoryId,
    subCategory: subCategoryId,
    mainImage: productImages.mainImage,
    images: productImages.images,
    variants,
    specifications,
    basePrice,
    stock: totalStock,
    tags: [brand.toLowerCase(), productType, "new-arrival"],
    isActive: true,
    isFeatured: Math.random() > 0.6,
    sku: mainSku, // Add the top-level SKU
  };

  return product;
};

// ===================================================================================
// CATEGORY & SUBCATEGORY GENERATORS
// ===================================================================================

const categoryNames = [
  "Điện thoại", "Laptop", "Máy tính bảng", "Đồng hồ thông minh",
  "Tai nghe", "TV", "Máy ảnh", "Gaming", "PC", "Phụ kiện", "Sạc dự phòng", "Thiết bị nhà thông minh"
];

const subCategoryNames = {
  "Điện thoại": ["Samsung", "Apple", "Xiaomi", "Oppo"],
  "Laptop": ["Laptop Gaming", "Laptop Văn phòng", "Macbook"],
  "Gaming": ["Console", "Tay cầm", "Phụ kiện Gaming"],
  "PC": ["Gaming PC", "Workstation", "All-in-One", "Mini PC"],
  "Phụ kiện": ["Bao da, ốp lưng", "Cáp sạc", "Bàn phím, chuột", "Sạc không dây"],
  "Sạc dự phòng": ["Dung lượng lớn", "Sạc nhanh", "Sạc không dây"],
  "Thiết bị nhà thông minh": ["Loa thông minh", "Đèn thông minh", "Ổ cắm thông minh", "Thiết bị giám sát"],
};

const icons = [
  "fas fa-mobile-alt", "fas fa-laptop", "fas fa-tablet-alt", "fas fa-tv",
  "fas fa-headphones", "fas fa-camera", "fas fa-gamepad", "fas fa-microchip",
];

export const generateRandomCategory = () => {
  const name = randomElement(categoryNames);
  const image = `https://dummyimage.com/400x300/e0e0e0/5c5c5c.png&text=${encodeURIComponent(name)}`;

  return {
    name: name,
    description: `Danh mục sản phẩm ${name}`,
    icon: randomElement(icons),
    image: image,
    metaTitle: `${name} chính hãng, giá tốt`,
    metaDescription: `Mua ${name} chính hãng, giá tốt, nhiều ưu đãi`,
    isActive: true,
    isFeatured: Math.random() > 0.5,
  };
};

export const generateRandomSubCategory = (parentId, parentName) => {
  const availableSubcategories = subCategoryNames[parentName] || [`${parentName} loại 1`, `${parentName} loại 2`];
  const name = randomElement(availableSubcategories);

  return {
    name: name,
    description: `Danh mục ${name} thuộc ${parentName}`,
    parentId: parentId,
    isActive: true,
    isFeatured: Math.random() > 0.7,
  };
};