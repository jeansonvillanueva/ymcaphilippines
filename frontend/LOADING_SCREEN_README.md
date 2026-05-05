# Loading Screen Implementation

## Overview

This is a complete loading screen system with the YMCA logo and smooth animations that displays while the website is loading data.

## Components

### 1. **LoadingContext** (`context/LoadingContext.tsx`)
- Global context to manage loading state
- Can be used anywhere in the app with the `useLoading()` hook

### 2. **LoadingScreen Component** (`components/LoadingScreen.tsx`)
- The actual loading screen UI
- Displays YMCA logo with fade animation
- Shows a spinning loader
- Automatically fades out when loading is complete

### 3. **LoadingScreen Styles** (`components/LoadingScreen.css`)
- Subtle animations: logo fade pulse, spinner rotation, text pulse
- Responsive design for mobile and desktop
- Smooth fade-out transition

### 4. **useLoadingScreen Hook** (`hooks/useLoadingScreen.ts`)
- Optional utility hook for controlling loading screen from page components
- Useful when waiting for async data to load

## Features

✅ **YMCA Logo Display** - Features your logo.webp with a subtle pulse animation
✅ **Spinner Animation** - Rotating loader that complements the logo
✅ **Subtle Styling** - Soft gradient background with professional appearance
✅ **Smooth Transitions** - Fade-out animation when loading completes
✅ **Responsive** - Adapts to mobile and desktop sizes
✅ **Auto-hide** - Automatically disappears after initial app load

## How It Works

1. **Initial Load**: The loading screen shows by default when the app first loads
2. **Content Ready**: Once `AppContent` is mounted, the loading screen fades out automatically
3. **Manual Control**: Pages can optionally extend the loading state using the `useLoadingScreen()` hook

## Usage

### Basic Setup (Already Done)
The loading screen is already integrated into your `App.tsx` and works automatically on initial page load.

### Optional: Control Loading from a Page Component

If a specific page needs to wait for data before showing content:

```tsx
import { useLoadingScreen } from '../hooks/useLoadingScreen';
import { useVideos } from '../hooks/useApi';

function MyPage() {
  const { videos, isLoading } = useVideos();
  
  // Show loading screen while fetching videos
  useLoadingScreen(isLoading);

  return (
    <div>
      {videos.map(video => (
        <div key={video.id}>{video.title}</div>
      ))}
    </div>
  );
}
```

### Manual Control

You can also manually control the loading screen in any component:

```tsx
import { useLoading } from '../context/LoadingContext';

function MyComponent() {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // Show loading screen
    setIsLoading(true);

    // Do something async
    fetchData().then(() => {
      // Hide loading screen
      setIsLoading(false);
    });
  }, [setIsLoading]);

  return <div>Content</div>;
}
```

## Customization

### Change Logo
Edit `LoadingScreen.tsx` and update the import:
```tsx
import logoImg from '../assets/images/your-logo.png';
```

### Adjust Animation Speed
In `LoadingScreen.css`, modify the animation duration in these keyframes:
- `logo-fade`: Change `1.5s` to desired duration
- `spin`: Change `1s` to desired duration
- `pulse-text`: Change `1.5s` to desired duration

### Change Colors
In `LoadingScreen.css`, update the CSS variables:
- Border color of spinner: `#1b5e99` (YMCA blue - modify as needed)
- Background gradient: Update the `background` property
- Text color: Modify `.loading-text color` property

### Disable/Enable Loading Text
To remove the "Loading..." text, edit `LoadingScreen.tsx` and comment out:
```tsx
<p className="loading-text">Loading...</p>
```

## Files Structure

```
src/
├── context/
│   └── LoadingContext.tsx          # Global loading state management
├── components/
│   ├── LoadingScreen.tsx           # Loading screen component
│   ├── LoadingScreen.css           # Animations and styling
│   └── ...
├── hooks/
│   ├── useLoadingScreen.ts         # Optional utility hook
│   └── ...
└── App.tsx                         # Updated with LoadingProvider
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS animations are hardware-accelerated for smooth performance
- Responsive design works on all screen sizes

## Performance Notes

- The loading screen is minimal and doesn't impact performance
- Animations use CSS transforms (GPU-accelerated)
- No JavaScript animation library dependencies
- Automatically garbage collected when unmounted

## Troubleshooting

**Loading screen not disappearing?**
- Make sure `App.tsx` has been updated with the LoadingProvider
- Check browser console for errors
- Try clearing browser cache and reloading

**Logo not showing?**
- Verify `logo.webp` exists in `src/assets/images/`
- Check the image path in `LoadingScreen.tsx`
- Inspect the browser console for 404 errors

**Animations look choppy?**
- Check if your device supports CSS animations
- Try disabling browser extensions that might interfere
- Ensure hardware acceleration is enabled in browser settings
