# Phone-Only Authentication System

## Overview

This document describes the phone-only authentication system implemented for the Karno e-commerce platform. The system provides a seamless, minimal-input user experience with the following key features:

- Phone number-only authentication (no email, name, or password required)
- SMS verification code for login/registration
- Automatic authentication prompt when adding to cart if not logged in
- Success message and redirect to homepage after successful login
- Consistent authentication experience across the application

## Components

### 1. Authentication Modal

The `AuthModal` component (`src/components/AuthModal.js`) provides a reusable modal dialog for phone authentication that can be triggered from anywhere in the application. It handles:

- Phone number input with validation
- SMS verification code request and validation
- Automatic user creation for new phone numbers
- Success messaging and redirection

### 2. Authentication Context

The `AuthModalContext` (`src/contexts/AuthModalContext.js`) provides application-wide access to the authentication modal, allowing any component to trigger the authentication flow when needed.

```jsx
// Example usage
import { useAuthModal } from '../contexts/AuthModalContext';

const SomeComponent = () => {
  const { openAuthModal } = useAuthModal();
  
  const handleAction = () => {
    openAuthModal('/redirect-path-after-login');
  };
  
  return <Button onClick={handleAction}>Action requiring auth</Button>;
};
```

### 3. Cart Integration

The cart system is integrated with the authentication flow to provide a seamless experience:

- `AddToCartButton` component (`src/components/AddToCartButton.js`) - A reusable button that handles authentication checks when adding products to cart
- `CartAuthNotification` component (`src/components/CartAuthNotification.js`) - A notification that appears when unauthenticated users have items in their cart
- `cartUtils.js` (`src/utils/cartUtils.js`) - Utility functions for cart operations with authentication handling

## Authentication Flow

1. **User adds a product to cart**
   - If authenticated: Product is added to cart
   - If not authenticated: Authentication modal opens

2. **Phone number entry**
   - User enters their phone number
   - System validates the format (must start with 9 and have 10 digits)
   - System sends a 6-digit verification code via SMS

3. **Verification code entry**
   - User enters the verification code
   - System validates the code
   - If valid:
     - For new users: Creates a new account
     - For existing users: Logs them in
   - Shows success message: "Your account has been successfully created. You can now continue shopping."
   - Redirects to homepage

4. **Post-authentication**
   - User can now browse freely and add products to cart
   - Cart contents are preserved throughout the session

## Backend Integration

The frontend authentication system integrates with the following backend endpoints:

- `POST /auth/request-verification` - Request a verification code for a phone number
- `POST /auth/verify-phone` - Verify a phone number with a code and login/register

## Implementation Details

### Redux State Management

The authentication state is managed in the Redux store (`src/store/slices/authSlice.js`) with the following actions:

- `requestPhoneVerification` - Request a verification code
- `verifyPhone` - Verify a phone number and login/register

### User Model

The user model is simplified to require only a phone number, with other fields being optional:

```javascript
{
  phone: "9123456789",  // Required
  phoneVerified: true,  // Set to true after verification
  firstName: null,      // Optional
  lastName: null,       // Optional
  email: null,          // Optional
  // Other optional fields...
}
```

## Security Considerations

- Verification codes expire after 5 minutes
- Maximum 3 verification attempts per code
- Automatic account locking after multiple failed attempts
- Secure JWT token storage
- HTTPS for all API communications

## Future Enhancements

- Add option for users to add additional information to their profile after registration
- Implement account recovery options
- Add two-factor authentication for sensitive operations
- Improve verification code delivery reliability with fallback options
