// Basic SEO analysis types
interface CommonKeywords {
  value: Record<string, number>;
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface SEODescription {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface H1Contents {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface H2Contents {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface ImageAltAttributes {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface KeywordsInTitleAndDescription {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface LinksRatio {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface SEOTitle {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

// Basic SEO section
interface BasicSEO {
  common_keywords: CommonKeywords;
  SEO_description: SEODescription;
  H1_contents: H1Contents;
  H2_contents: H2Contents;
  Image_ALT_Attributes: ImageAltAttributes;
  Keywords_in_Title_and_Description: KeywordsInTitleAndDescription;
  Links_Ratio: LinksRatio;
  SEO_Title: SEOTitle;
}

// Advanced SEO analysis types
interface SearchPreview {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface MobileSearchPreview {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface CanonicalContents {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface NoIndexDescription {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface CheckCanonicalization {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface OGContents {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface RobotTextAnalytics {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

interface CheckSchemaMeta {
  value: string[];
  message: string;
  valid: "true" | "false" | "undecisive";
}

// Advanced SEO section
interface AdvancedSEO {
  search_preview: SearchPreview;
  mobile_search_preview: MobileSearchPreview;
  mobile_scr_path: string[];
  canonical_contents: CanonicalContents;
  noindex_description: NoIndexDescription;
  checkcanonicalization: CheckCanonicalization;
  og_contents: OGContents;
  robot_text_analytics: RobotTextAnalytics;
  checkschemameta: CheckSchemaMeta;
}

// Main response structure
interface AdvanceSEOResponse {
  basic_seo: BasicSEO;
  advance_seo: AdvancedSEO;
}

// Root response type
interface SEOAnalysisResponse {
  status: "success" | "error" | "pending";
  advance_seo: AdvanceSEOResponse;
}

// Export the main type for use
export type { SEOAnalysisResponse };

// Alternative: More generic approach for flexibility
interface SEOItem<T = string[]> {
  value: T;
  message: string;
  valid: "true" | "false" | "undecisive";
}

// Generic version using the SEOItem interface
 interface GenericSEOAnalysisResponse {
  status: "success" | "error" | "pending";
  advance_seo: {
    basic_seo: {
      common_keywords: SEOItem<Record<string, number>>;
      SEO_description: SEOItem<string[]>;
      H1_contents: SEOItem<string[]>;
      H2_contents: SEOItem<string[]>;
      Image_ALT_Attributes: SEOItem<string[]>;
      Keywords_in_Title_and_Description: SEOItem<string[]>;
      Links_Ratio: SEOItem<string[]>;
      SEO_Title: SEOItem<string[]>;
    };
    advance_seo: {
      search_preview: SEOItem<string[]>;
      mobile_search_preview: SEOItem<string[]>;
      mobile_scr_path: string[];
      canonical_contents: SEOItem<string[]>;
      noindex_description: SEOItem<string[]>;
      checkcanonicalization: SEOItem<string[]>;
      og_contents: SEOItem<string[]>;
      robot_text_analytics: SEOItem<string[]>;
      checkschemameta: SEOItem<string[]>;
    };
  };
}

export type { GenericSEOAnalysisResponse, SEOItem };