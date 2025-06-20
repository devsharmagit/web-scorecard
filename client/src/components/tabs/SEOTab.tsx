import { getGrade } from '../../constants/grading';
import type { PageSpeedData } from '../../types/pagespeed';
import {Loader2 } from 'lucide-react';
import { extractDesktopSEOData } from '../../lib/helper';

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

  const filteredData = extractDesktopSEOData(data);

  const score = filteredData?.seo?.score || 0;
  const passedDiagnostics = filteredData?.seo?.diagnostics?.passed || [];
  const failedDiagnostics = filteredData?.seo?.diagnostics?.failed || [];
  failedDiagnostics.pop()

  return (
    <div className="mx-auto bg-white">
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-8 py-10">
        <div className="flex-1">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className={`text-6xl font-semibold text-gray-900`}>
              {getGrade(Math.round(score))}
            </div>
            <h1 className="text-xl font-bold text-gray-900">Search Engine Optimization Score</h1>
            <p className="text-gray-600 text-sm max-w-xl text-center">
              Measures the effectiveness of your website’s optimization for search engines, impacting visibility and organic traffic generation.
            </p>
          </div>
        </div>
      
      </div>

    {/* Passed Diagnostics Section */}
      {passedDiagnostics.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Passed Diagnostics</h2>
          {passedDiagnostics.map((diagnostic, index) => (
            <div key={index} className="bg-white border border-[#799F92] rounded-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-xl text-gray-900">{diagnostic.title}</h3>
                    <span className="px-2 py-1 rounded text-sm font-medium bg-[#799F92] text-white">
                      Excellent
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {diagnostic.description.split('[')[0].trim()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

         {failedDiagnostics.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Failed Diagnostics</h2>
          {failedDiagnostics.map((diagnostic, index) => (
            <div key={index} className="bg-white border border-[#fa3] rounded-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-xl text-gray-900">{diagnostic.title}</h3>
                    <span className="px-2 py-1 rounded text-sm font-medium bg-[#fa3] text-white">
                      Needs Improvement
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {diagnostic.description.split('[')[0].trim()}
                  </p>
                  {diagnostic.displayValue && (
                    <div className="text-xs text-gray-600 mt-2 font-medium">
                      Impact: {diagnostic.displayValue}
                    </div>
                  )}
                  {diagnostic.recommended_details && diagnostic.recommended_details.items?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        <span className="text-gray-500">Snippet:</span>{" "}
                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {diagnostic.recommended_details.items[0]?.node?.snippet || 'N/A'}
                        </code>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        <span className="text-gray-500">Selector:</span>{" "}
                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded break-all">
                          {diagnostic.recommended_details.items[0]?.node?.selector || 'N/A'}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}   
    
    </div>
  );
}

export default SEOTab;