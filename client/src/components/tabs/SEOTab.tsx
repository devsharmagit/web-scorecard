import { getGrade } from '../../constants/grading';
import type { PageSpeedData } from '../../types/pagespeed';
import {Loader2 } from 'lucide-react';

interface SEOTabProps {
  data: PageSpeedData | null; // Allow data to be null initially
  loading?: boolean;
}

const SEOTab = ({ data, loading }: SEOTabProps) => {

   if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Analyzing SEO metrics...</span>
      </div>
    );
  }

  if (!data?.lighthouseResult) {
    return (
      <div className="text-center text-gray-500 py-8">
        No SEO data available
      </div>
    );
  }
  
   const { lighthouseResult } = data;
  const { categories, audits } = lighthouseResult;

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-[#799F92]';
    if (score >= 0.5) return 'text-[#fa3]';
    return 'text-red-600';
  };

  // SEO-specific audits
  const seoAudits = [
    'document-title',
    'meta-description',
    'link-text',
    'image-alt',
    'hreflang',
    'canonical',
    'robots-txt',
    'structured-data',
    'font-display',
    'tap-targets',
    'viewport',
    'plugins',
    'charset',
    'http-status-code',
    'is-crawlable',
    'uses-https',
    'uses-long-cache-ttl',
    'total-byte-weight',
    'uses-text-compression',
    'uses-responsive-images'
  ];

  const getSEOAudits = () => {
    return seoAudits
      .map(auditKey => {
        const audit = audits[auditKey];
        if (!audit) return null;
        
        return {
          key: auditKey,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          displayValue: audit.displayValue,
          details: audit.details
        };
      })
      .filter(audit => audit !== null);
  };

  const seoAuditResults = getSEOAudits();

  // Group audits by status
  const passedAudits = seoAuditResults.filter(audit => audit?.score !== null && audit.score >= 0.9);
  const needsImprovementAudits = seoAuditResults.filter(audit => audit?.score !== null && audit.score >= 0.5 && audit.score < 0.9);
  const failedAudits = seoAuditResults.filter(audit => audit?.score !== null && audit.score < 0.5);

  return (
    <div className="mx-auto bg-white">
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-8 py-10">
        <div className="flex-1">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className={`text-6xl font-semibold text-gray-900`}>
              {getGrade(Math.round(categories.seo.score * 100))}
            </div>
            <h1 className="text-xl font-bold text-gray-900">Search Engine Optimization Score</h1>
            <p className="text-gray-600 text-sm max-w-xl text-center">
              Measures the effectiveness of your website’s optimization for search engines, impacting visibility and organic traffic generation.
            </p>
          </div>
        </div>
      
      </div>

      {/* Failed Audits - High Priority */}
      {failedAudits.length > 0 && (
        <div className="bg-white rounded-sm px-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-semibold text-xl text-gray-900">Critical SEO Issues</h3>
            <span className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
              {failedAudits.length} Issues
            </span>
          </div>
          <div className="space-y-3">
            {failedAudits.map((audit) => (
              <div key={audit?.key} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{audit?.title}</div>
                    <div className="text-sm text-gray-700">{audit?.description}</div>
                    {audit?.displayValue && (
                      <div className="text-xs text-red-600 mt-1 font-medium">
                        Impact: {audit.displayValue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Improvement Audits */}
      {needsImprovementAudits.length > 0 && (
        <div className="bg-white rounded-sm px-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-semibold text-xl text-gray-900">Areas for Improvement</h3>
            <span className="px-2 py-1 rounded text-sm font-medium bg-[#fa3] text-white">
              {needsImprovementAudits.length} Items
            </span>
          </div>
          <div className="space-y-3">
            {needsImprovementAudits.map((audit) => (
              <div key={audit?.key} className="bg-white p-4 rounded-lg border border-[#fa3]">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{audit?.title}</div>
                    <div className="text-sm text-gray-700">{audit?.description}</div>
                    {audit?.displayValue && (
                      <div className="text-xs text-gray-600 mt-1 font-medium">
                        Impact: {audit.displayValue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passed Audits */}
      {passedAudits.length > 0 && (
        <div className="bg-white rounded-sm px-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-semibold text-xl text-gray-900">Optimized Elements</h3>
            <span className="px-2 py-1 rounded text-sm font-medium bg-[#799F92] text-white">
              {passedAudits.length} Passed
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passedAudits.map((audit) => (
              <div key={audit?.key} className="bg-white p-4 rounded-lg border border-[#799F92]">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{audit?.title}</div>
                    <div className="text-sm text-gray-700">{audit?.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall SEO Score */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall SEO Score</span>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${getScoreColor(categories.seo.score)}`}>
              {Math.round(categories.seo.score * 100)}
            </div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SEOTab;