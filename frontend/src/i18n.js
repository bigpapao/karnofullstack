import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Persian translations
const resources = {
  fa: {
    translation: {
      // Common translations
      "app.name": "کارنو",
      "app.description": "فروشگاه آنلاین قطعات خودرو",
      
      // Navigation
      "nav.home": "خانه",
      "nav.products": "محصولات",
      "nav.categories": "دسته‌بندی‌ها",
      "nav.brands": "برندها",
      "nav.cart": "سبد خرید",
      "nav.account": "حساب کاربری",
      
      // Auth
      "auth.login": "ورود",
      "auth.register": "ثبت نام",
      "auth.logout": "خروج",
      "auth.phone": "شماره موبایل",
      "auth.password": "رمز عبور",
      "auth.forgotPassword": "فراموشی رمز عبور",
      
      // Products
      "products.search": "جستجوی محصولات",
      "products.filter": "فیلتر",
      "products.sort": "مرتب‌سازی",
      "products.addToCart": "افزودن به سبد خرید",
      "products.price": "قیمت",
      "products.availability": "موجودی",
      
      // Cart
      "cart.title": "سبد خرید",
      "cart.empty": "سبد خرید شما خالی است",
      "cart.total": "جمع کل",
      "cart.checkout": "تکمیل خرید",
      
      // Messages
      "messages.success": "عملیات با موفقیت انجام شد",
      "messages.error": "خطا در انجام عملیات",
      "messages.loading": "در حال بارگذاری...",
      
      // Validation
      "validation.required": "این فیلد الزامی است",
      "validation.phone": "شماره موبایل نامعتبر است",
      "validation.password": "رمز عبور باید حداقل ۶ کاراکتر باشد",
      
      // Footer
      "footer.about": "درباره ما",
      "footer.contact": "تماس با ما",
      "footer.terms": "قوانین و مقررات",
      "footer.privacy": "حریم خصوصی",
      "footer.social": "شبکه‌های اجتماعی"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fa', // Set Persian as the only language
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false // Disable Suspense for better performance
    }
  });

export default i18n; 