// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product related types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Order related types
export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Address related types
export interface Address {
  id: string;
  user: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart related types
export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: string;
  quantity: number;
  price: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Component Props types
export interface LoadingProps {
  message?: string;
  size?: number;
  fullPage?: boolean;
  delay?: number;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface AlertMessageProps {
  severity: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string | React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  autoHide?: boolean;
  autoHideTimeout?: number;
  sx?: object;
} 