/**
 * Sitemap Generation Script
 * 
 * This script generates the sitemap.xml file for the Karno e-commerce platform.
 * It's designed to be run during the build process or via a scheduled task.
 */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { format } from 'date-fns';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the website
const BASE_URL = process.env.SITE_URL || 'https://karno.ir';
// API base URL
const API_URL = process.env.API_URL || 'https://api.karno.ir';
// Output file path
const OUTPUT_PATH = path.resolve(path.join(__dirname, '../../../public/sitemap.xml'));
// Flag to use mock data when API is unavailable
const USE_MOCK = true;

// Mock data for when API is unavailable
const MOCK_PRODUCTS = [
  { slug: 'engine-oil-5w30-synthetic', updatedAt: new Date() },
  { slug: 'air-filter-pride', updatedAt: new Date() },
  { slug: 'brake-pad-samand', updatedAt: new Date() },
  { slug: 'oil-filter-peugeot-206', updatedAt: new Date() },
  { slug: 'spark-plug-ngk', updatedAt: new Date() },
];

const MOCK_BRANDS = [
  { slug: 'bosch', updatedAt: new Date() },
  { slug: 'ngk', updatedAt: new Date() },
  { slug: 'castrol', updatedAt: new Date() },
  { slug: 'mobil', updatedAt: new Date() },
];

/**
 * Generate sitemap XML content for static pages
 * @returns {string} XML string for static pages
 */
const generateStaticPagesXML = () => {
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/products', priority: 0.9, changefreq: 'daily' },
    { url: '/brands', priority: 0.8, changefreq: 'weekly' },
    { url: '/models', priority: 0.8, changefreq: 'weekly' },
    { url: '/contact', priority: 0.5, changefreq: 'monthly' },
  ];

  const currentDate = format(new Date(), 'yyyy-MM-dd');

  return pages.map(page => `
    <url>
      <loc>${BASE_URL}${page.url}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('');
};

/**
 * Generate sitemap XML content for dynamic product pages
 * @returns {Promise<string>} XML string for product pages
 */
const generateProductsXML = async () => {
  try {
    let products = [];
    
    if (USE_MOCK) {
      try {
        const response = await axios.get(`${API_URL}/api/products/sitemap`);
        products = response.data.data || [];
      } catch (error) {
        console.log('Using mock product data for sitemap');
        products = MOCK_PRODUCTS;
      }
    } else {
      const response = await axios.get(`${API_URL}/api/products/sitemap`);
      products = response.data.data || [];
    }
    
    return products.map(product => `
      <url>
        <loc>${BASE_URL}/products/${product.slug}</loc>
        <lastmod>${format(new Date(product.updatedAt), 'yyyy-MM-dd')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `).join('');
  } catch (error) {
    console.error('Error generating product sitemap:', error);
    return '';
  }
};

/**
 * Generate sitemap XML content for brand pages
 * @returns {Promise<string>} XML string for brand pages
 */
const generateBrandsXML = async () => {
  try {
    let brands = [];
    
    if (USE_MOCK) {
      try {
        const response = await axios.get(`${API_URL}/api/brands/sitemap`);
        brands = response.data.data || [];
      } catch (error) {
        console.log('Using mock brand data for sitemap');
        brands = MOCK_BRANDS;
      }
    } else {
      const response = await axios.get(`${API_URL}/api/brands/sitemap`);
      brands = response.data.data || [];
    }
    
    return brands.map(brand => `
      <url>
        <loc>${BASE_URL}/brands/${brand.slug}</loc>
        <lastmod>${format(new Date(brand.updatedAt), 'yyyy-MM-dd')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
      </url>
    `).join('');
  } catch (error) {
    console.error('Error generating brand sitemap:', error);
    return '';
  }
};

/**
 * Generate the complete sitemap.xml content
 * @returns {Promise<string>} Complete XML sitemap
 */
const generateSitemapXML = async () => {
  try {
    const staticPagesXML = generateStaticPagesXML();
    const productsXML = await generateProductsXML();
    const brandsXML = await generateBrandsXML();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPagesXML}
${productsXML}
${brandsXML}
</urlset>`;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generateStaticPagesXML()}
</urlset>`;
  }
};

/**
 * Main function to generate and write the sitemap.xml file
 */
const main = async () => {
  try {
    console.log('Generating sitemap.xml...');
    const sitemap = await generateSitemapXML();
    
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write sitemap to file
    fs.writeFileSync(OUTPUT_PATH, sitemap);
    console.log(`Sitemap generated successfully at ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the script
main(); 