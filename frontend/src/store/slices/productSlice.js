import { createSlice } from '@reduxjs/toolkit';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'لنت ترمز جلو پراید',
    slug: 'pride-front-brake-pad',
    brand: 'سایپا',
    price: 850000,
    discountPrice: 750000,
    rating: 4.5,
    reviewCount: 128,
    image: '/images/products/pride-brake-pad.jpg',
    category: 'Brakes',
    description: 'لنت ترمز جلو با کیفیت بالا برای پراید و تیبا',
    stockQuantity: 25,
    inStock: true,
  },
  {
    id: 2,
    name: 'فیلتر روغن سمند',
    slug: 'samand-oil-filter',
    brand: 'ایران خودرو',
    price: 120000,
    discountPrice: null,
    rating: 4.8,
    reviewCount: 95,
    image: '/images/products/samand-oil-filter.jpg',
    category: 'Oil',
    description: 'فیلتر روغن اصلی برای خودروهای سمند و پژو پارس',
    stockQuantity: 42,
    inStock: true,
  },
  {
    id: 3,
    name: 'شمع خودرو دنا',
    slug: 'dena-spark-plug',
    brand: 'ایران خودرو',
    price: 450000,
    discountPrice: 399000,
    rating: 4.7,
    reviewCount: 64,
    image: '/images/products/dena-spark-plug.jpg',
    category: 'Electrical',
    description: 'شمع اصلی خودرو دنا با کیفیت بالا و عملکرد عالی',
    stockQuantity: 18,
    inStock: true,
  },
  {
    id: 4,
    name: 'فیلتر هوای کوییک',
    slug: 'quick-air-filter',
    brand: 'سایپا',
    price: 180000,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 82,
    image: '/images/products/quick-air-filter.jpg',
    category: 'Engine',
    description: 'فیلتر هوای با کیفیت برای خودرو کوییک',
    stockQuantity: 30,
    inStock: true,
  },
  {
    id: 5,
    name: 'کمک فنر عقب پژو 206',
    slug: 'peugeot-206-rear-shock-absorber',
    brand: 'ایران خودرو',
    price: 1290000,
    discountPrice: 1090000,
    rating: 4.4,
    reviewCount: 56,
    image: '/images/products/peugeot-206-shock.jpg',
    category: 'Suspension',
    description: 'کمک فنر عقب با کیفیت بالا برای پژو 206',
    stockQuantity: 12,
    inStock: true,
  },
  {
    id: 6,
    name: 'تسمه تایم سمند EF7',
    slug: 'samand-ef7-timing-belt',
    brand: 'ایران خودرو',
    price: 850000,
    discountPrice: 799000,
    rating: 4.9,
    reviewCount: 42,
    image: '/images/products/samand-timing-belt.jpg',
    category: 'Engine',
    description: 'تسمه تایم اصلی برای موتور EF7 خودروهای سمند',
    stockQuantity: 0,
    inStock: false,
  },
  {
    id: 7,
    name: 'چراغ جلو دنا',
    slug: 'dena-headlight',
    brand: 'ایران خودرو',
    price: 2850000,
    discountPrice: 2650000,
    rating: 4.6,
    reviewCount: 38,
    image: '/images/products/dena-headlight.jpg',
    category: 'Lights',
    description: 'چراغ جلو اصلی خودروی دنا با کیفیت بالا',
    stockQuantity: 8,
    inStock: true,
  },
  {
    id: 8,
    name: 'باتری اتمی پراید',
    slug: 'pride-battery',
    brand: 'سایپا',
    price: 1950000,
    discountPrice: 1850000,
    rating: 4.3,
    reviewCount: 72,
    image: '/images/products/pride-battery.jpg',
    category: 'Battery',
    description: 'باتری اتمی مخصوص پراید با طول عمر بالا',
    stockQuantity: 15,
    inStock: true,
  },
  {
    id: 9,
    name: 'رادیاتور کولر پژو 206',
    slug: 'peugeot-206-ac-radiator',
    brand: 'ایران خودرو',
    price: 1680000,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 29,
    image: '/images/products/peugeot-206-ac-radiator.jpg',
    category: 'AC',
    description: 'رادیاتور کولر اصلی برای پژو 206',
    stockQuantity: 6,
    inStock: true,
  },
  {
    id: 10,
    name: 'دسته موتور تیبا',
    slug: 'tiba-engine-mount',
    brand: 'سایپا',
    price: 580000,
    discountPrice: 520000,
    rating: 4.2,
    reviewCount: 45,
    image: '/images/products/tiba-engine-mount.jpg',
    category: 'Engine',
    description: 'دسته موتور با کیفیت برای خودرو تیبا',
    stockQuantity: 20,
    inStock: true,
  },
  {
    id: 11,
    name: 'سنسور اکسیژن سمند',
    slug: 'samand-oxygen-sensor',
    brand: 'ایران خودرو',
    price: 950000,
    discountPrice: 890000,
    rating: 4.7,
    reviewCount: 31,
    image: '/images/products/samand-oxygen-sensor.jpg',
    category: 'Electrical',
    description: 'سنسور اکسیژن اصلی برای خودروهای سمند',
    stockQuantity: 14,
    inStock: true,
  },
  {
    id: 12,
    name: 'لاستیک یزد تایر سایز 185/65R14',
    slug: 'yazd-tire-185-65-r14',
    brand: 'یزد تایر',
    price: 2450000,
    discountPrice: null,
    rating: 4.4,
    reviewCount: 58,
    image: '/images/products/yazd-tire.jpg',
    category: 'Tires',
    description: 'لاستیک ایرانی با کیفیت بالا مناسب برای پراید و تیبا',
    stockQuantity: 24,
    inStock: true,
  },
];

const initialState = {
  products: mockProducts,
  product: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    brand: null,
    priceRange: [0, 1000000],
    sortBy: 'newest',
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    fetchProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  updateFilters,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;
