import { Monitor, Loader2,} from "lucide-react";
import { getGrade } from "../../constants/grading";
import type { PageSpeedData } from "../../types/pagespeed";
import { extractDesktopData } from "../../lib/helper";
import ImproveWebsiteButton from "../ui/ImproveWebsiteButton";

interface DesktopTabProps {
  data: PageSpeedData | null; // Allow data to be null initially
  loading?: boolean;
  isEliteClient: boolean; 
}

const DesktopTab = ({ data, loading, isEliteClient }: DesktopTabProps) => {


  // Helper function to get overall performance grade
  const getPerformanceGrade = (score: number) => {
   return getGrade(score)
  };

  // Helper function to format score as percentage
  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Analyzing desktop performance...</span>
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
  const performanceScore = data.lighthouseResult.categories?.performance?.score || 0;
  
  const filteredData = extractDesktopData(data);
  const speedIndex = filteredData?.performance?.analytics["speed-index"];
  const totalBlockingTime = filteredData?.performance?.analytics["total-blocking-time"];
  const passedDiagnostics = filteredData?.performance?.diagnostics?.passed || [];
  const failedDiagnostics = filteredData?.performance?.diagnostics?.failed || [];
  
  console.log("Filtered Desktop Data:", filteredData);

  return (
    <div className="mx-auto bg-white">
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className={`text-6xl font-semibold`}>
              {getPerformanceGrade(formatScore(performanceScore))}
            </div>
              <h1 className="text-xl font-bold text-gray-900">Desktop Performance</h1>
              <p className="text-gray-600 text-sm max-w-xl text-center" >
                Evaluates the speed and functionality of your website on desktop devices, ensuring optimal user experience for desktop users.
              </p>
               {!isEliteClient && <ImproveWebsiteButton />}
          </div>
        </div>
        <div className="w-full flex-1 md:flex justify-center">
        <div className="hidden md:block py-10">
          <div className="w-48 h-32 bg-gray-200 rounded-lg relative overflow-hidden border-4 border-gray-800">
            {/* Monitor frame top */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-800 rounded-full"></div>
            {/* Screenshot container */}
            <div className="absolute top-4 left-1 right-1 bottom-4 bg-white rounded-sm overflow-hidden">
              {data?.lighthouseResult?.fullPageScreenshot?.screenshot?.data ? (
                <img 
                  src={data.lighthouseResult.fullPageScreenshot.screenshot.data}
                  alt="Website screenshot"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-xs text-gray-600 text-center px-2">
                    <Monitor className="w-4 h-4 mx-auto mb-1" />
                    Website Preview
                  </div>
                </div>
              )}
            </div>
            {/* Monitor stand */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-800 rounded-t"></div>
          </div>
        </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Speed Index */}
        {speedIndex && (
          <div className="border-gray-200 border  p-6 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Speed Index</h3>
            </div>
            <div className="text-2xl font-bold text-[#799F92] mb-2">
              {speedIndex.displayValue}
            </div>
            <p className="text-sm text-gray-600">
              {speedIndex.description.split('[')[0].trim()}
            </p>
          </div>
        )}

        {/* Total Blocking Time */}
        {totalBlockingTime && (
          <div className="bg-white border-gray-200 border p-6 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Total Blocking Time</h3>
            </div>
            <div className="text-2xl font-bold text-[#799F92] mb-2">
              {totalBlockingTime.displayValue}
            </div>
            <p className="text-sm text-gray-600">
              {totalBlockingTime.description.split('[')[0].trim()}
            </p>
          </div>
        )}
      </div>

      {/* Opportunities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Opportunities</h2>
       
       
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
                  {diagnostic.displayValue && (
                    <div className="text-xs text-gray-600 mt-2 font-medium">
                      Value: {diagnostic.displayValue}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Failed Diagnostics Section */}
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
                  
                  {/* Table for failed diagnostics with details */}
                  {diagnostic.recommended_details && diagnostic.recommended_details.items && (
                    <div className="mt-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-50 border border-gray-200 rounded">
                          <thead className="bg-gray-100">
                            <tr>
                              {diagnostic.recommended_details.headings && diagnostic.recommended_details.headings.map((heading, headingIndex) => (heading.label &&
                                <th key={headingIndex} className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                                  {heading.label || heading.key || heading.valueType}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {diagnostic.recommended_details.items.slice(0, 5).map((item, itemIndex) => (
                              <tr key={itemIndex} className="hover:bg-gray-50">
                                {diagnostic.recommended_details.headings && diagnostic.recommended_details.headings.map((heading, headingIndex) => (heading.label &&
                                  <td key={headingIndex} className="px-4 py-2 text-sm text-gray-900 border-b">
                                    {typeof item === 'object' && item !== null 
                                      ? (item[heading.key] || item[heading.valueType] || '-')
                                      : (Array.isArray(item) ? item[headingIndex] : item)
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
    </div>
  );
}

export default DesktopTab;