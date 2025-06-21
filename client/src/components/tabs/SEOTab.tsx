import type { PageSpeedData } from '../../types/pagespeed';
import {Loader2 } from 'lucide-react';
import { extractDesktopSEOData } from '../../lib/helper';
import PassedDiagnostics from '../ui/PassedDiagnostics';
import FailedDiagnostics from '../ui/FailedDiagnostics';
import Grade from '../ui/Grade';

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
      <div className="flex items-center justify-between mb-8 py-5 lg:py-10">
        <Grade 
          description="Measures the effectiveness of your website’s optimization for search engines, impacting visibility and organic traffic generation."
          score={score}
          title="Search Engine Optimization Score"
          showButton={false}
          isEliteClient={false} // Assuming this is not needed for SEO tab
        />      
      </div>

    {/* Passed Diagnostics Section */}
    <PassedDiagnostics passedDiagnostics={passedDiagnostics} />

        {/* Failed Diagnostics Section  */}
        <FailedDiagnostics failedDiagnostics={failedDiagnostics} />
    
    </div>
  );
}

export default SEOTab;