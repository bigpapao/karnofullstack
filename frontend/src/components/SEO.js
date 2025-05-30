import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing document head metadata
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} [props.canonical] - Canonical URL
 * @param {Object} [props.openGraph] - Open Graph metadata
 * @param {string} [props.robots] - Robots meta tag content
 * @param {Array} [props.additionalMetaTags] - Additional meta tags
 * @param {string} [props.noIndex] - Whether to noindex the page
 */
const SEO = ({
  title,
  description,
  canonical,
  openGraph,
  robots,
  additionalMetaTags = [],
  noIndex = false,
}) => {
  // Default site name to use in title
  const defaultSiteName = 'فروشگاه اینترنتی کارنو';
  
  // Ensure title has site name if not already included
  const fullTitle = title.includes(defaultSiteName) 
    ? title 
    : `${title} | ${defaultSiteName}`;
  
  // Organize Open Graph metadata
  const og = {
    type: 'website',
    site_name: defaultSiteName,
    title: fullTitle,
    description: description,
    url: canonical,
    ...openGraph,
  };
  
  // Sets default robots if none specified and handling noIndex
  const robotsContent = noIndex 
    ? 'noindex, nofollow' 
    : robots || 'index, follow';
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph Metadata */}
      <meta property="og:type" content={og.type} />
      <meta property="og:title" content={og.title} />
      <meta property="og:description" content={og.description} />
      <meta property="og:site_name" content={og.site_name} />
      {og.url && <meta property="og:url" content={og.url} />}
      {og.image && <meta property="og:image" content={og.image} />}
      {og.image_alt && <meta property="og:image:alt" content={og.image_alt} />}
      {og.locale && <meta property="og:locale" content={og.locale} />}
      
      {/* Twitter Card Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={og.title} />
      <meta name="twitter:description" content={og.description} />
      {og.image && <meta name="twitter:image" content={og.image} />}
      
      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, i) => (
        <meta key={`meta-tag-${i}`} {...tag} />
      ))}
      
      {/* Persian language and RTL direction */}
      <html lang="fa" dir="rtl" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonical: PropTypes.string,
  openGraph: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
    image_alt: PropTypes.string,
    locale: PropTypes.string,
    site_name: PropTypes.string,
  }),
  robots: PropTypes.string,
  additionalMetaTags: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.string)
  ),
  noIndex: PropTypes.bool,
};

export default SEO; 