import type { PageSpeedData } from '../../types/pagespeed';
import { extractDesktopSEOData } from '../../lib/helper';
import PassedDiagnostics from '../ui/PassedDiagnostics';
import FailedDiagnostics from '../ui/FailedDiagnostics';
import Grade from '../ui/Grade';
import Loader from '../ui/Loader';

interface SEOTabProps {
  data: PageSpeedData | null; // Allow data to be null initially
  loading?: boolean;
  isError: boolean
   isEliteClient: boolean;
}

const SEOTab = ({ data, loading, isError ,isEliteClient }: SEOTabProps) => {

   if (loading) {
    return (
      <Loader text='Loading SEO data ...' />
    );
  }

   if(isError){
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching SEO data.
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
          showButton={true}
          isEliteClient={isEliteClient} 
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