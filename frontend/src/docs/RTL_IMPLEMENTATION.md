# RTL and Persian Typography Implementation

This document outlines the implementation of Right-to-Left (RTL) support and Persian typography for the Karno application.

## Architecture

The RTL implementation is structured into several logical components:

1. **Document Direction Management**
   - `DirectionContext.js` - Context provider that manages RTL/LTR state
   - `RTLWrapper.js` - High-level component that combines direction context with Material UI's RTL support
   - `setDocumentDirectionAndLanguage()` - Utility function that updates HTML attributes

2. **Component-Level Direction Utilities**
   - React hooks for direction-aware components
   - Clear separation from document-level utilities to avoid circular dependencies
   - Named with "use" prefix to follow React hook conventions

3. **Text Analysis Utilities**
   - Language detection (Persian vs. non-Persian)
   - Automatic direction and language setting based on content

4. **Specialized UI Components**
   - `AutoDirectionText` - Sets text direction based on content analysis
   - `IconFlip` - Controls icon flipping behavior in RTL mode
   - `PersianTypography` - Typography with Persian number conversion

## File Structure

```
src/
├── contexts/
│   └── DirectionContext.js     # Direction state management
├── components/
│   ├── RTLWrapper.js           # Top-level RTL wrapper
│   ├── RTL.js                  # Material UI RTL integration
│   ├── AutoDirectionText.js    # Content-based direction
│   ├── IconFlip.js             # RTL icon flipping
│   ├── PersianTypography.js    # Persian text styling
│   ├── PersianPrice.js         # Price formatting
│   └── PersianDate.js          # Date formatting
├── utils/
│   ├── directionUtils.js       # Document-level direction utilities
│   ├── directionComponentUtils.js # Component-level hooks
│   └── typographyUtils.js      # Persian text utilities
└── styles/
    ├── rtl.css                 # RTL-specific styles
    └── fonts.css               # Persian font declarations
```

## Usage Examples

### 1. Setting Document Direction

To wrap your application with RTL support:

```jsx
<RTLWrapper initialDirection="rtl" showToggle={true}>
  <App />
</RTLWrapper>
```

### 2. Direction-Aware Components

Using the direction context in a component:

```jsx
import { useDirection } from '../contexts/DirectionContext';

const MyComponent = () => {
  const { direction, toggleDirection } = useDirection();
  
  return (
    <div>
      Current direction: {direction}
      <button onClick={toggleDirection}>Toggle Direction</button>
    </div>
  );
};
```

### 3. Using Direction Utility Hooks

```jsx
import { useDirectionalValue, useDirectionalStyles } from '../utils/directionComponentUtils';

const MyComponent = () => {
  // Return "Back" in LTR mode, "بازگشت" in RTL mode
  const buttonText = useDirectionalValue('بازگشت', 'Back');
  
  // Swap left/right properties automatically
  const styles = useDirectionalStyles({
    paddingLeft: '1rem',
    marginRight: '2rem'
  });
  
  return <button style={styles}>{buttonText}</button>;
};
```

### 4. Auto-Direction Text

For multilingual content with automatic direction:

```jsx
import AutoDirectionText from '../components/AutoDirectionText';

<AutoDirectionText>
  This English text will display left-to-right.
</AutoDirectionText>

<AutoDirectionText>
  این متن فارسی از راست به چپ نمایش داده می‌شود.
</AutoDirectionText>
```

### 5. Icon Flipping in RTL

To properly handle icons in RTL mode:

```jsx
import IconFlip from '../components/IconFlip';
import ArrowIcon from '../icons/Arrow';

// Will flip in RTL mode
<IconFlip>
  <ArrowIcon />
</IconFlip>

// Won't flip in RTL mode
<IconFlip shouldFlip={false}>
  <SettingsIcon />
</IconFlip>
```

### 6. Persian Typography

```jsx
import PersianTypography from '../components/PersianTypography';

<PersianTypography variant="h1">
  عنوان فارسی با اعداد 123
</PersianTypography>
// Output: عنوان فارسی با اعداد ۱۲۳
```

## Design Considerations

1. **Separation of Concerns**
   - Document-level utilities vs. component-level hooks
   - Static text analysis vs. context-dependent styling

2. **Circular Dependency Prevention**
   - Careful structuring of utility files
   - Clear documentation of dependencies

3. **Performance Optimization**
   - Minimal DOM manipulation
   - Efficient text analysis

4. **Flexibility**
   - Toggle direction for testing
   - Override automatic direction when needed

## Testing RTL Implementation

The application includes several example components to test and demonstrate RTL functionality:

- `/examples/bilingual` - Demonstrates bilingual content handling
- `/examples/typography` - Shows Persian typography features
- `/examples/icons` - Demonstrates icon flipping behavior

## Best Practices

1. Use `AutoDirectionText` for user-generated or multilingual content
2. Use `IconFlip` for directional icons (arrows, navigation)
3. Set `shouldFlip={false}` for symmetrical icons (star, settings)
4. Use `PersianTypography` for text that contains numbers
5. Utilize the direction hooks for conditional styling/rendering 