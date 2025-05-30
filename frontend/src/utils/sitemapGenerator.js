/**
 * Sitemap Generator Utility
 * 
 * This utility helps generate the sitemap.xml file for the Karno e-commerce platform.
 * Requires server-side processing to implement properly with dynamic routes.
 */
import axios from 'axios';
import { format } from 'date-fns';

// Base URL for the website
const BASE_URL = 'https://karno.ir';

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
    const response = await axios.get(`${BASE_URL}/api/products/sitemap`);
    const products = response.data.data || [];
    
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
    const response = await axios.get(`${BASE_URL}/api/brands/sitemap`);
    const brands = response.data.data || [];
    
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
export const generateSitemapXML = async () => {
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
 * Write the sitemap.xml file to the public directory
 * 
 * NOTE: This function needs to be run server-side,
 * such as during the build process or via a Node.js script.
 * It cannot be run directly in the browser.
 */
export const writeSitemapFile = async () => {
  // This is a placeholder for server-side implementation
  // In a real implementation, you would:
  // 1. Generate the XML using generateSitemapXML()
  // 2. Write it to a file in the public directory
  // 3. Schedule regular updates (e.g., daily)
  
  // Example implementation for a Node.js environment:
  /*
  import fs from 'fs';
  import path from 'path';
  
  const sitemap = await generateSitemapXML();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully');
  */
}; 