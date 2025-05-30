export const mockProducts = [
  {
    id: 1,
    name: 'روغن موتور سینتیوم 5W-40',
    description: 'روغن موتور با کیفیت بالا مناسب برای خودروهای سواری',
    price: 850000,
    category: 'روغن موتور',
    brand: 'کاسترول',
    stock: 50,
    images: [
      'https://example.com/oil1.jpg',
      'https://example.com/oil2.jpg'
    ],
    specifications: {
      viscosity: '5W-40',
      volume: '4 لیتر',
      type: 'تمام سینتتیک'
    },
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-02-01T14:20:00Z'
  },
  {
    id: 2,
    name: 'فیلتر روغن پژو 206',
    description: 'فیلتر روغن اصلی مناسب برای پژو 206',
    price: 180000,
    category: 'فیلتر',
    brand: 'ساکورا',
    stock: 120,
    images: [
      'https://example.com/filter1.jpg'
    ],
    specifications: {
      model: 'پژو 206',
      type: 'فیلتر روغن',
      quality: 'اصلی'
    },
    status: 'active',
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T08:15:00Z'
  },
  {
    id: 3,
    name: 'لنت ترمز جلو سمند',
    description: 'لنت ترمز با کیفیت برای سمند و پژو 405',
    price: 450000,
    category: 'لنت ترمز',
    brand: 'آیسین',
    stock: 75,
    images: [
      'https://example.com/brake1.jpg',
      'https://example.com/brake2.jpg'
    ],
    specifications: {
      model: 'سمند و پژو 405',
      position: 'جلو',
      material: 'نیمه فلزی'
    },
    status: 'active',
    createdAt: '2024-01-25T11:45:00Z',
    updatedAt: '2024-02-02T09:30:00Z'
  }
];

export const getProducts = () => {
  return Promise.resolve(mockProducts);
};

export const getProductById = (id) => {
  const product = mockProducts.find(p => p.id === parseInt(id));
  return Promise.resolve(product || null);
};

export const createProduct = (productData) => {
  const newProduct = {
    ...productData,
    id: mockProducts.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockProducts.push(newProduct);
  return Promise.resolve(newProduct);
};

export const updateProduct = (id, productData) => {
  const index = mockProducts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('Product not found'));
  
  mockProducts[index] = {
    ...mockProducts[index],
    ...productData,
    updatedAt: new Date().toISOString()
  };
  return Promise.resolve(mockProducts[index]);
};

export const deleteProduct = (id) => {
  const index = mockProducts.findIndex(p => p.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('Product not found'));
  
  mockProducts.splice(index, 1);
  return Promise.resolve({ success: true });
}; 