/**
 * Structured Data Utilities
 * 
 * Functions to generate JSON-LD structured data for different page types
 * to improve search engine understanding and rich results
 */

/**
 * Generate organization structured data
 * @returns {Object} Organization schema
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'Karno',
    url: 'https://karno.ir',
    logo: 'https://karno.ir/images/logo.png',
    sameAs: [
      'https://www.instagram.com/karno_ir/',
      'https://t.me/karno_ir'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+982112345678',
      contactType: 'customer service',
      areaServed: 'IR',
      availableLanguage: ['Persian', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'خیابان اصلی، پلاک 123',
      addressLocality: 'تهران',
      postalCode: '12345',
      addressCountry: 'IR'
    }
  };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} items - Breadcrumb items
 * @returns {Object} BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate product structured data
 * @param {Object} product - Product data
 * @returns {Object} Product schema
 */
export const generateProductSchema = (product) => {
  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : ['https://karno.ir/images/product-placeholder.jpg'];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Karno'
    },
    offers: {
      '@type': 'Offer',
      url: `https://karno.ir/products/${product.slug}`,
      priceCurrency: 'IRR',
      price: product.discountPrice || product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock'
    }
  };
};

/**
 * Generate local business structured data
 * @returns {Object} LocalBusiness schema
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'Karno',
    image: 'https://karno.ir/images/storefront.jpg',
    '@id': 'https://karno.ir',
    url: 'https://karno.ir',
    telephone: '+982112345678',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'خیابان اصلی، پلاک 123',
      addressLocality: 'تهران',
      postalCode: '12345',
      addressCountry: 'IR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.6892,
      longitude: 51.3890
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '10:00',
        closes: '16:00'
      }
    ]
  };
}; 