/**
 * Breadcrumbs Component
 * 
 * A customized breadcrumb navigation component that supports
 * right-to-left (RTL) layouts and SEO-friendly structured data.
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box 
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { generateBreadcrumbSchema } from '../utils/structuredData';
import SEO from './SEO';

/**
 * Custom Breadcrumbs component
 * 
 * @param {Object} props
 * @param {Array} props.links - Array of breadcrumb link objects with path and label properties
 * @param {string} props.currentPage - Label for the current page (last breadcrumb)
 * @param {string} props.domain - Optional domain for SEO schema (defaults to karno.ir)
 * @param {Object} props.sx - Additional MUI styles for the container
 */
const Breadcrumbs = ({ links = [], currentPage, domain = 'karno.ir', sx = {} }) => {
  // Generate structured data for SEO
  const breadcrumbItems = links.map(link => ({
    name: link.label,
    url: `https://${domain}${link.path}`
  }));
  
  if (currentPage) {
    const currentPath = window.location.pathname;
    breadcrumbItems.push({
      name: currentPage,
      url: `https://${domain}${currentPath}`
    });
  }
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  
  return (
    <>
      {/* Add structured data to page */}
      <SEO schema={breadcrumbSchema} />
      
      {/* Breadcrumbs UI */}
      <Box sx={{ mb: 3, direction: 'rtl', ...sx }}>
        <MuiBreadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="مسیر ناوبری"
        >
          <Link component={RouterLink} to="/" color="inherit">
            خانه
          </Link>
          
          {links.map((link, index) => (
            <Link
              key={index}
              component={RouterLink}
              to={link.path}
              color="inherit"
            >
              {link.label}
            </Link>
          ))}
          
          {currentPage && (
            <Typography color="text.primary">
              {currentPage}
            </Typography>
          )}
        </MuiBreadcrumbs>
      </Box>
    </>
  );
};

export default Breadcrumbs; 