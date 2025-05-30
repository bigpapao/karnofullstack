# Integration Guide: Login & Registration Components

This guide explains how to integrate the updated Login and Registration components into your Karno e-commerce application.

## Components Overview

1. **Login Component** (`src/pages/Login.js`)
   - Mobile number authentication using Iranian phone format
   - Password input with visibility toggle
   - Remember me functionality
   - Session ID integration for cart merging
   - Fully responsive with Tailwind CSS

2. **Registration Component** (`src/pages/Register.js`)
   - Complete user registration form
   - Phone number validation for Iranian mobiles
   - Simple password requirement (8 characters)
   - Terms and conditions acceptance
   - Client-side validation with helpful error messages

## Integration Steps

### 1. Route Configuration

The components are already integrated in the main App.js file with these routes:
- `/login` - Login page
- `/register` - Registration page

```jsx
// In App.js (already implemented)
<Route path="login" element={<Login />} />
<Route path="register" element={<Register />} />
```

### 2. Navigation Links

To add navigation links to these pages from other parts of your application:

```jsx
import { Link } from 'react-router-dom';

// Login link
<Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
  ورود به حساب کاربری
</Link>

// Registration link
<Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
  ثبت نام
</Link>
```

### 3. Auth Modal Integration

To update your auth modal to work with these components (for checkout flow):

1. Add navigation options in your auth modal:

```jsx
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  
  const goToLoginPage = () => {
    onClose();
    navigate('/login');
  };
  
  const goToRegisterPage = () => {
    onClose();
    navigate('/register');
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ورود یا ثبت نام</DialogTitle>
      <DialogContent>
        <p>برای ادامه باید وارد حساب کاربری خود شوید یا ثبت نام کنید.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={goToLoginPage}>ورود</Button>
        <Button onClick={goToRegisterPage} variant="contained">ثبت نام</Button>
      </DialogActions>
    </Dialog>
  );
};
```

### 4. Redirects After Authentication

Both components handle redirects based on:
- The previous location (stored in location state)
- Default redirect to homepage

### 5. Testing the Integration

After integrating, test the following flows:

1. Guest user → Login → Checkout
2. Guest user → Registration → Checkout
3. Cart merging when a guest user logs in
4. Form validation for both forms
5. Error handling for authentication failures

## Tailwind CSS Integration

The components use Tailwind CSS for styling. Make sure that Tailwind is properly configured in your project:

1. Tailwind CSS configuration is already set up in:
   - `tailwind.config.js`
   - `postcss.config.js`

2. Tailwind directives are already included in:
   - `src/index.css`

## Troubleshooting

If you encounter issues with the integration:

1. **URL Redirects**: Ensure your ProtectedRoute component properly saves the attempted URL
2. **Styling Issues**: Check that Tailwind CSS is properly loaded
3. **API Connection**: Verify that both components can communicate with your authentication API
4. **Cart Merging**: Make sure session IDs are properly passed between components

## Additional Resources

- See `AUTH_README.md` for more details on the implementation
- Refer to the phone validation utilities in `src/utils/phoneUtils.js`
- Session management utilities are in `src/utils/sessionUtils.js` 