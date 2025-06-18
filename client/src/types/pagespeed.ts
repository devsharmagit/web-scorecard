export interface PageSpeedData {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: Record<string, any>;
    fullPageScreenshot: {
      screenshot: {
        data: string; // Base64 encoded image data
    }
  }},
  loadingExperience?: {
    metrics: {
      FIRST_CONTENTFUL_PAINT_MS?: { percentile: number; category: string };
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile: number; category: string };
      FIRST_INPUT_DELAY_MS?: { percentile: number; category: string };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: { percentile: number; category: string };
    };
    overall_category: string;
  };
  originLoadingExperience?: any;
    }

    
export interface AuditResult {
  key: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  details?: any;
} 