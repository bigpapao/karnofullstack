export const mockCategories = [
  {
    id: 1,
    name: 'روغن موتور',
    description: 'انواع روغن موتور برای خودروهای سواری و تجاری',
    slug: 'engine-oil',
    image: 'https://example.com/categories/engine-oil.jpg',
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'فیلتر',
    description: 'فیلترهای روغن، هوا و سوخت',
    slug: 'filters',
    image: 'https://example.com/categories/filters.jpg',
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 21,
        name: 'فیلتر روغن',
        description: 'انواع فیلتر روغن خودرو',
        slug: 'oil-filters',
        parentId: 2,
        status: 'active'
      },
      {
        id: 22,
        name: 'فیلتر هوا',
        description: 'انواع فیلتر هوای موتور',
        slug: 'air-filters',
        parentId: 2,
        status: 'active'
      }
    ]
  },
  {
    id: 3,
    name: 'لنت ترمز',
    description: 'انواع لنت ترمز برای خودروهای داخلی و خارجی',
    slug: 'brake-pads',
    image: 'https://example.com/categories/brake-pads.jpg',
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'قطعات موتوری',
    description: 'قطعات و لوازم یدکی موتور خودرو',
    slug: 'engine-parts',
    image: 'https://example.com/categories/engine-parts.jpg',
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: 41,
        name: 'پیستون',
        description: 'انواع پیستون موتور',
        slug: 'pistons',
        parentId: 4,
        status: 'active'
      },
      {
        id: 42,
        name: 'شاتون',
        description: 'انواع شاتون موتور',
        slug: 'connecting-rods',
        parentId: 4,
        status: 'active'
      }
    ]
  }
];

export const getCategories = () => {
  return Promise.resolve(mockCategories);
};

export const getCategoryById = (id) => {
  const category = mockCategories.find(c => c.id === parseInt(id));
  return Promise.resolve(category || null);
};

export const createCategory = (categoryData) => {
  const newCategory = {
    ...categoryData,
    id: mockCategories.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  };
  mockCategories.push(newCategory);
  return Promise.resolve(newCategory);
};

export const updateCategory = (id, categoryData) => {
  const index = mockCategories.findIndex(c => c.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('Category not found'));
  
  mockCategories[index] = {
    ...mockCategories[index],
    ...categoryData,
    updatedAt: new Date().toISOString()
  };
  return Promise.resolve(mockCategories[index]);
};

export const deleteCategory = (id) => {
  const index = mockCategories.findIndex(c => c.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('Category not found'));
  
  mockCategories.splice(index, 1);
  return Promise.resolve({ success: true });
}; 