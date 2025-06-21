import type { PageSpeedData } from "../types/pagespeed";

// Types for analytics metrics
export interface AnalyticsMetric {
  id: string;
  title: string;
  description: string;
  score: number;
  scoreDisplayMode: string;
  displayValue: string;
  numericValue: number;
  numericUnit: string;
}

// Types for diagnostic details (opportunity/table/debugdata)
export interface DiagnosticHeading {
  label: string;
  valueType: string;
  key: string;
}

export interface DiagnosticItem {
  [key: string]: any;
}

export interface DiagnosticDetails {
  type?: string;
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
  items?: DiagnosticItem[];
  headings?: DiagnosticHeading[];
  debugData?: any;
  sortedBy?: string[];
  metricSavings?: any;
}

// Types for diagnostics
export interface DiagnosticEntry {
  title: string;
  description: string;
  displayValue: string;
  recommended_details: DiagnosticDetails;
}

export interface Diagnostics {
  passed: DiagnosticEntry[];
  failed: DiagnosticEntry[];
}

// Main desktop data type
export interface DesktopPerformanceData {
  analytics: {
    'speed-index': AnalyticsMetric;
    'total-blocking-time': AnalyticsMetric;
    [key: string]: AnalyticsMetric;
  };
  score: number;
  diagnostics: Diagnostics;
  final_image: string;
}

export interface DesktopData {
  performance: DesktopPerformanceData;
}

// SEO types
export interface SeoDiagnosticEntry {
  title: string;
  description: string;
  displayValue: string;
  recommended_details: any;
}

export interface SeoDiagnostics {
  passed: SeoDiagnosticEntry[];
  failed: SeoDiagnosticEntry[];
}

export interface SeoData {
  seo: {
    score: number;
    diagnostics: SeoDiagnostics;
  };
}

// Update function signatures
export function extractDesktopData(data: any): DesktopData | null {
  if (!data.lighthouseResult) return null;

  const desktopAudits = data.lighthouseResult.audits;
  const desktopCategories = data.lighthouseResult.categories;

  const desktopData = {
    performance: {
      analytics: {
        'speed-index': desktopAudits['speed-index'],
        'total-blocking-time': desktopAudits['total-blocking-time'],
      },
      score: Math.ceil(desktopCategories.performance.score * 100),
      diagnostics: { passed: [], failed: [] },
      final_image: desktopAudits['final-screenshot']?.details?.data || ''
    }
  };

  // Diagnostics (Performance)
  const diagnostics = desktopCategories.performance.auditRefs.filter(
    (ref) => ref.group === 'diagnostics'
  );

  let passedCount = 0;
  let failedCount = 0;

  for (const diag of diagnostics) {
    if (passedCount >= 2 && failedCount >= 2) break;

    const audit = desktopAudits[diag.id];
    if (audit) {
      const auditData = {
        title: audit.title,
        description: audit.description,
        displayValue: audit.displayValue || '',
        recommended_details: audit.details,
      };

      if (audit.score !== null && audit.score > 0.5) {
        if (passedCount < 2) {
          desktopData.performance.diagnostics.passed.push(auditData);
          passedCount++;
        }
      } else {
        if (failedCount < 2) {
          desktopData.performance.diagnostics.failed.push(auditData);
          failedCount++;
        }
      }
    }
  }

  return desktopData;
}


export function extractDesktopSEOData(data: any): SeoData | null {
  if (!data.lighthouseResult) return null;

  const desktopAudits = data.lighthouseResult.audits;
  const desktopCategories = data.lighthouseResult.categories;

  const seoData = {
    seo: {
      score: Math.ceil(desktopCategories.seo.score * 100),
      diagnostics: { passed: [], failed: [] }
    }
  };

  for (const seo of desktopCategories.seo.auditRefs) {
    const audit = desktopAudits[seo.id];
    if (audit) {
      const auditData = {
        title: audit.title,
        description: audit.description || '',
        displayValue: audit.displayValue || '',
        recommended_details: audit.details || ''
      };

      if (audit.score !== null && audit.score > 0.5) {
        seoData.seo.diagnostics.passed.push(auditData);
      } else {
        seoData.seo.diagnostics.failed.push(auditData);
      }
    }
  }

  return seoData;
}
