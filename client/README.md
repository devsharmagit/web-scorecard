# Web Scorecard - PageSpeed Analysis Components

This project provides a comprehensive web performance analysis tool using Google's PageSpeed Insights API.

## Components Overview

### Main Components

#### `PageSpeedResults.tsx`
The main container component that displays PageSpeed analysis results in organized tabs:
- **Mobile Tab**: Shows mobile-specific performance metrics and insights
- **Desktop Tab**: Shows desktop-specific performance metrics and insights  
- **SEO Tab**: Shows SEO analysis and recommendations

#### `MobileResults.tsx`
Displays mobile performance analysis including:
- Overall performance scores (Performance, Accessibility, Best Practices, SEO)
- Real User Experience metrics (CrUX data)
- Core Web Vitals
- Key performance issues and opportunities

#### `DesktopResults.tsx`
Displays desktop performance analysis including:
- Overall performance scores
- Core Web Vitals metrics
- Real User Experience data
- Performance optimization opportunities

#### `SEOResults.tsx`
Displays comprehensive SEO analysis including:
- Overall SEO score
- Audit summary (Passed, Needs Improvement, Failed, Not Applicable)
- Critical issues and areas for improvement
- Good practices
- SEO recommendations

## Features

### Performance Metrics
- **First Contentful Paint (FCP)**: Time to first content render
- **Largest Contentful Paint (LCP)**: Time to largest content render
- **First Input Delay (FID)**: Time to first user interaction
- **Cumulative Layout Shift (CLS)**: Visual stability metric

### SEO Analysis
- Document title optimization
- Meta description quality
- Image alt text
- Link text quality
- HTTPS usage
- Mobile responsiveness
- And many more SEO factors

### User Experience
- Real user data from Chrome User Experience Report (CrUX)
- Performance categorization (Fast, Average, Slow)
- Loading experience metrics

## Usage

```tsx
import PageSpeedResults from './components/PageSpeedResults';

// In your component
<PageSpeedResults 
  mobileData={mobilePageSpeedData} 
  desktopData={desktopPageSpeedData} 
/>
```

## API Integration

The components work with Google's PageSpeed Insights API v5. The API response should include:
- `lighthouseResult.categories`: Performance, Accessibility, Best Practices, SEO scores
- `lighthouseResult.audits`: Detailed audit results
- `loadingExperience`: Real user experience metrics

## Styling

Components use Tailwind CSS for styling with a consistent color scheme:
- Green: Good scores and passed audits
- Yellow: Needs improvement
- Red: Poor scores and failed audits
- Blue: Information and recommendations

## TypeScript Support

All components are fully typed with TypeScript interfaces defined in `src/types/pagespeed.ts`.
