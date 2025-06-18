import { AlertTriangle, Clock, ExternalLink, Loader2 } from "lucide-react";
import { getGrade } from "../../constants/grading";
import type { PageSpeedData } from '../../types/pagespeed';

interface MobileTabProps {
  data: PageSpeedData | null;
  loading?: boolean;
}

const MobileTab = ({ data, loading }: MobileTabProps) => {
  
  
  // Helper function to get score color based on Lighthouse scoring
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600";
    if (score >= 0.5) return "text-orange-600";
    return "text-red-600";
  };

  // Helper function to get score background color
  const getScoreBgColor = (score: number) => {
    if (score >= 0.9) return "bg-green-100";
    if (score >= 0.5) return "bg-orange-100";
    return "bg-red-100";
  };

  // Helper function to get overall performance grade
  const getPerformanceGrade = (score: number) => {
   return getGrade(score)
  };


    const getMetricColor = (category: string) => {
    switch (category) {
      case 'FAST': return 'text-green-600';
      case 'AVERAGE': return 'text-yellow-600';
      case 'SLOW': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatMetric = (value: number, unit: string) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}s`;
    }
    return `${value}${unit}`;
  };

  // Helper function to format score as percentage
  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  // Helper function to get audit status badge
  const getAuditStatusBadge = (score: number) => {
    if (score >= 0.9) return { text: "Excellent", className: "bg-green-100 text-green-800" };
    if (score >= 0.5) return { text: "Needs Improvement", className: "bg-orange-100 text-orange-800" };
    return { text: "Poor", className: "bg-red-100 text-red-800" };
  };

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
  const loadingExperience = data.loadingExperience;
  const performanceScore = data.lighthouseResult.categories?.performance?.score || 0;
  const audits = data.lighthouseResult.audits;
  
  // Key metrics
  const speedIndex = audits?.["speed-index"];
  const totalBlockingTime = audits?.["total-blocking-time"];
  const firstContentfulPaint = audits?.["first-contentful-paint"];
  const largestContentfulPaint = audits?.["largest-contentful-paint"];
  const cumulativeLayoutShift = audits?.["cumulative-layout-shift"];
  
  // Opportunities
  const renderBlockingResources = audits?.["render-blocking-resources"];
  const offscreenImages = audits?.["offscreen-images"];
  const properlySize = audits?.["uses-responsive-images"];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4">
            <div className={`text-6xl font-bold ${getScoreColor(performanceScore)}`}>
              {getPerformanceGrade(formatScore(performanceScore))}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Mobile Performance</h1>
              <p className="text-gray-600">
                Evaluates the speed and functionality of your website on mobile devices, directly influencing user experience and conversion rates.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="w-32 h-64 bg-gray-200 rounded-lg relative overflow-hidden border-4 border-gray-800">
            {/* Phone frame top */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
            
            {/* Screenshot container */}
            <div className="absolute top-4 left-1 right-1 bottom-4 bg-white rounded-sm overflow-hidden">
              {data?.lighthouseResult?.fullPageScreenshot?.screenshot?.data ? (
                <img 
                  src={data.lighthouseResult.fullPageScreenshot.screenshot.data}
                  alt="Website screenshot"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-xs text-gray-600 text-center px-2">
                    Website Preview
                  </div>
                </div>
              )}
            </div>
            
            {/* Phone frame bottom */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 border-2 border-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Speed Index */}
        {speedIndex && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Speed Index</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(speedIndex.score)} ${getScoreColor(speedIndex.score)}`}>
                {formatScore(speedIndex.score)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {speedIndex.displayValue}
            </div>
            <p className="text-sm text-gray-600">
              {speedIndex.description.split('[')[0].trim()}
            </p>
          </div>
        )}

        {/* Total Blocking Time */}
        {totalBlockingTime && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Total Blocking Time</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalBlockingTime.displayValue}
            </div>
            <p className="text-sm text-gray-600">
              {totalBlockingTime.description.split('[')[0].trim()}
            </p>
          </div>
        )}
      </div>

      {/* Additional Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {firstContentfulPaint && (
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">First Contentful Paint</div>
            <div className={`text-xl font-bold ${getScoreColor(firstContentfulPaint.score)}`}>
              {firstContentfulPaint.displayValue}
            </div>
          </div>
        )}

        {largestContentfulPaint && (
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Largest Contentful Paint</div>
            <div className={`text-xl font-bold ${getScoreColor(largestContentfulPaint.score)}`}>
              {largestContentfulPaint.displayValue}
            </div>
          </div>
        )}

        {cumulativeLayoutShift && (
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Cumulative Layout Shift</div>
            <div className={`text-xl font-bold ${getScoreColor(cumulativeLayoutShift.score)}`}>
              {cumulativeLayoutShift.displayValue}
            </div>
          </div>
        )}
      </div>

      {/* Opportunities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Opportunities</h2>
        
        {/* Eliminate render-blocking resources */}
        {renderBlockingResources && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">Eliminate render-blocking resources</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getAuditStatusBadge(renderBlockingResources.score).className}`}>
                    {getAuditStatusBadge(renderBlockingResources.score).text}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.{" "}
                  <a href="https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/" 
                     className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    Learn how to eliminate render-blocking resources
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                {renderBlockingResources.displayValue && (
                  <div className="text-sm text-gray-500">
                    Potential savings: {renderBlockingResources.displayValue}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Defer offscreen images */}
        {offscreenImages && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">Defer offscreen images</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getAuditStatusBadge(offscreenImages.score).className}`}>
                    {getAuditStatusBadge(offscreenImages.score).text}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Consider lazy-loading offscreen and hidden images after all critical resources have finished loading to lower time to interactive.{" "}
                  <a href="https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/" 
                     className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    Learn how to defer offscreen images
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                {offscreenImages.displayValue && (
                  <div className="text-sm text-gray-500">
                    Potential savings: {offscreenImages.displayValue}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Properly size images */}
        {properlySize && properlySize.score < 1 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">Properly size images</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getAuditStatusBadge(properlySize.score).className}`}>
                    {getAuditStatusBadge(properlySize.score).text}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Serve images that are appropriately-sized to save cellular data and improve load time.{" "}
                  <a href="https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images/" 
                     className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    Learn how to size images
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                {properlySize.displayValue && (
                  <div className="text-sm text-gray-500">
                    Potential savings: {properlySize.displayValue}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Experience */}
      {loadingExperience && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Real User Experience Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-600">First Contentful Paint</div>
                <div className={`text-xl font-bold ${getMetricColor(loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category)}`}>
                  {formatMetric(loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile, 'ms')}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category.toLowerCase()}
                </div>
              </div>
            )}

            {loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-600">Largest Contentful Paint</div>
                <div className={`text-xl font-bold ${getMetricColor(loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.category)}`}>
                  {formatMetric(loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile, 'ms')}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.category.toLowerCase()}
                </div>
              </div>
            )}

            {loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-600">First Input Delay</div>
                <div className={`text-xl font-bold ${getMetricColor(loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category)}`}>
                  {formatMetric(loadingExperience.metrics.FIRST_INPUT_DELAY_MS.percentile, 'ms')}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category.toLowerCase()}
                </div>
              </div>
            )}

            {loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-600">Cumulative Layout Shift</div>
                <div className={`text-xl font-bold ${getMetricColor(loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category)}`}>
                  {loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category.toLowerCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Performance Issues */}
      <div className="bg-red-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Key Performance Issues
        </h4>
        <div className="space-y-3">
          {Object.entries(audits)
            .filter(([_key, audit]) => audit.score !== null && audit.score < 0.9 && audit.details)
            .slice(0, 5)
            .map(([key, audit]) => (
              <div key={key} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="font-medium text-red-900 mb-1">{audit.title}</div>
                <div className="text-sm text-red-700">{audit.description}</div>
                {audit.displayValue && (
                  <div className="text-xs text-red-600 mt-1 font-medium">
                    Impact: {audit.displayValue}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Overall Performance Score */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Performance Score</span>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
              {formatScore(performanceScore)}
            </div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTab;