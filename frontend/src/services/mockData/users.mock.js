export const mockUsers = [
  {
    id: 101,
    firstName: 'علی',
    lastName: 'محمدی',
    email: 'ali@example.com',
    phone: '09123456789',
    role: 'user',
    status: 'active',
    addresses: [
      {
        id: 1,
        title: 'خانه',
        address: 'تهران، خیابان ستارخان، پلاک 123',
        postalCode: '1234567890',
        isDefault: true
      }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-02-01T15:30:00Z',
    lastLoginAt: '2024-02-03T09:15:00Z'
  },
  {
    id: 102,
    firstName: 'رضا',
    lastName: 'کریمی',
    email: 'reza@example.com',
    phone: '09187654321',
    role: 'user',
    status: 'active',
    addresses: [
      {
        id: 2,
        title: 'محل کار',
        address: 'اصفهان، خیابان چهارباغ، کوچه گلها، پلاک 45',
        postalCode: '8765432109',
        isDefault: true
      }
    ],
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-02-02T11:20:00Z',
    lastLoginAt: '2024-02-03T14:30:00Z'
  },
  {
    id: 103,
    firstName: 'مریم',
    lastName: 'احمدی',
    email: 'maryam@example.com',
    phone: '09198765432',
    role: 'user',
    status: 'active',
    addresses: [
      {
        id: 3,
        title: 'خانه',
        address: 'شیراز، بلوار زند، کوچه 12، پلاک 78',
        postalCode: '7654321098',
        isDefault: true
      }
    ],
    createdAt: '2024-02-01T09:45:00Z',
    updatedAt: '2024-02-03T10:15:00Z',
    lastLoginAt: '2024-02-03T15:45:00Z'
  },
  {
    id: 1,
    firstName: 'مدیر',
    lastName: 'سیستم',
    email: 'admin@karno.ir',
    phone: '09100000000',
    role: 'admin',
    status: 'active',
    addresses: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-03T16:00:00Z',
    lastLoginAt: '2024-02-03T16:00:00Z'
  }
];

export const getUsers = () => {
  return Promise.resolve(mockUsers);
};

export const getUserById = (id) => {
  const user = mockUsers.find(u => u.id === parseInt(id));
  return Promise.resolve(user || null);
};

export const getUserByEmail = (email) => {
  const user = mockUsers.find(u => u.email === email);
  return Promise.resolve(user || null);
};

export const createUser = (userData) => {
  const newUser = {
    ...userData,
    id: mockUsers.length + 1,
    status: 'active',
    addresses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockUsers.push(newUser);
  return Promise.resolve(newUser);
};

export const updateUser = (id, userData) => {
  const index = mockUsers.findIndex(u => u.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('User not found'));
  
  mockUsers[index] = {
    ...mockUsers[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  return Promise.resolve(mockUsers[index]);
};

export const updateUserStatus = (id, status) => {
  const index = mockUsers.findIndex(u => u.id === parseInt(id));
  if (index === -1) return Promise.reject(new Error('User not found'));
  
  mockUsers[index] = {
    ...mockUsers[index],
    status,
    updatedAt: new Date().toISOString()
  };
  return Promise.resolve(mockUsers[index]);
};

export const addUserAddress = (userId, addressData) => {
  const userIndex = mockUsers.findIndex(u => u.id === parseInt(userId));
  if (userIndex === -1) return Promise.reject(new Error('User not found'));
  
  const newAddress = {
    ...addressData,
    id: mockUsers[userIndex].addresses.length + 1
  };
  
  mockUsers[userIndex].addresses.push(newAddress);
  mockUsers[userIndex].updatedAt = new Date().toISOString();
  
  return Promise.resolve(newAddress);
}; 