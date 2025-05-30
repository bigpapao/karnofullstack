/**
 * Code Cleanup Script
 * 
 * This script automatically fixes ESLint warnings related to unused imports and variables.
 * It uses the ESLint --fix option to automatically remove unused code.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Files with ESLint warnings to fix
const filesToFix = [
  'src/App.js',
  'src/components/AdminHeader.js',
  'src/components/BrandCard.js',
  'src/components/ProductCard.js',
  'src/components/ReviewSection.js',
  'src/components/WhyChooseUs.js',
  'src/pages/Brands.js',
  'src/pages/Checkout.js',
  'src/pages/EditProfile.js',
  'src/pages/ForgotPassword.js',
  'src/pages/ModelDetail.js',
  'src/pages/Models.js',
  'src/pages/PhoneLogin.js',
  'src/pages/ProductDetail.js',
  'src/pages/Products.js',
  'src/pages/Profile.js',
  'src/pages/ResetPassword.js',
  'src/pages/VerifyEmail.js',
  'src/pages/admin/Users.js',
  'src/utils/cartUtils.js'
];

// Fix the cartUtils.js export issue
const fixCartUtils = () => {
  const filePath = path.join(process.cwd(), 'src/utils/cartUtils.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace anonymous export with named export
  if (content.includes('export default {')) {
    content = content.replace(
      'export default {', 
      'const cartUtils = {\n'
    );
    content += '\n\nexport default cartUtils;';
    fs.writeFileSync(filePath, content);
    console.log('✅ Fixed anonymous export in cartUtils.js');
  }
};

// Run ESLint with --fix option on each file
const runEslintFix = () => {
  filesToFix.forEach(file => {
    try {
      console.log(`Fixing ${file}...`);
      execSync(`npx eslint --fix ${file}`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`Error fixing ${file}:`, error.message);
    }
  });
};

console.log('Starting code cleanup...');
fixCartUtils();
runEslintFix();
console.log('Code cleanup completed!');
