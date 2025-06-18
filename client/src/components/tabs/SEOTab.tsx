import React from 'react'
import type { PageSpeedData } from '../../types/pagespeed';
import { AlertTriangle, CheckCircle, Loader2, Search, TrendingUp, XCircle } from 'lucide-react';

interface SEOTabProps {
  data: PageSpeedData | null; // Allow data to be null initially
  loading?: boolean;
}

const SEOTab = ({ data, loading }: SEOTabProps) => {

   if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />

        <span className="ml-2 text-gray-600">Analyzing mobile performance...</span>
      </div>
    );
  }

  if (!data?.lighthouseResult) {
    return (
      <div className="text-center text-gray-500 py-8">
        No performance data available
      </div>
    );
  }
  
   const { lighthouseResult } = data;
  const { categories, audits } = lighthouseResult;

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Good';
    if (score >= 0.5) return 'Needs Improvement';
    return 'Poor';
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
  const notApplicableAudits = seoAuditResults.filter(audit => audit?.score === null);

  console.log({passedAudits, needsImprovementAudits, failedAudits, notApplicableAudits});

  return (
    <div className="space-y-6">

      {/* Overall SEO Score */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-8 h-8 text-orange-600" />
            <h4 className="text-xl font-bold text-orange-900">Overall SEO Score</h4>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(categories.seo.score)} mb-2`}>
            {Math.round(categories.seo.score * 100)}
          </div>
          <div className="text-lg text-orange-700 font-medium">
            {getScoreLabel(categories.seo.score)}
          </div>
        </div>
      </div>

      {/* Audit Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{passedAudits.length}</div>
          <div className="text-sm text-green-700 font-medium">Passed</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{needsImprovementAudits.length}</div>
          <div className="text-sm text-yellow-700 font-medium">Needs Improvement</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{failedAudits.length}</div>
          <div className="text-sm text-red-700 font-medium">Failed</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{notApplicableAudits.length}</div>
          <div className="text-sm text-blue-700 font-medium">Not Applicable</div>
        </div>
      </div>

      {/* Failed Audits - High Priority */}
      {failedAudits.length > 0 && (
        <div className="bg-red-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Critical Issues ({failedAudits.length})
          </h4>
          <div className="space-y-3">
            {failedAudits.map((audit) => (
              <div key={audit?.key} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-red-900 mb-1">{audit?.title}</div>
                    <div className="text-sm text-red-700">{audit?.description}</div>
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

      {/* Needs Improvement Audits - Medium Priority */}
      {needsImprovementAudits.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Areas for Improvement ({needsImprovementAudits.length})
          </h4>
          <div className="space-y-3">
            {needsImprovementAudits.map((audit) => (
              <div key={audit?.key} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-yellow-900 mb-1">{audit?.title}</div>
                    <div className="text-sm text-yellow-700">{audit?.description}</div>
                    {audit?.displayValue && (
                      <div className="text-xs text-yellow-600 mt-1 font-medium">
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

      {/* Passed Audits - Good Practices */}
      {passedAudits.length > 0 && (
        <div className="bg-green-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Good Practices ({passedAudits.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {passedAudits.map((audit) => (
              <div key={audit?.key} className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-green-900 mb-1">{audit?.title}</div>
                    <div className="text-sm text-green-700">{audit?.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Recommendations */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          SEO Recommendations
        </h4>
        <div className="space-y-3">
          {failedAudits.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-900 mb-2">Priority Actions:</div>
              <ul className="text-sm text-blue-700 space-y-1">
                {failedAudits.slice(0, 3).map((audit) => (
                  <li key={audit?.key} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Fix {audit?.title.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {needsImprovementAudits.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-900 mb-2">Optimization Opportunities:</div>
              <ul className="text-sm text-blue-700 space-y-1">
                {needsImprovementAudits.slice(0, 3).map((audit) => (
                  <li key={audit?.key} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Improve {audit?.title.toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SEOTab