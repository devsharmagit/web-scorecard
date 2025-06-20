import { Loader2 } from "lucide-react";
import { getGrade, getScoreColor } from "../../constants/grading";
import type { PageSpeedData } from '../../types/pagespeed';
import { extractDesktopData } from "../../lib/helper";
import ImproveWebsiteButton from "../ui/ImproveWebsiteButton";
import { ScoreIcon } from "../ui/ScoreIcons";
import RecommendationTable from "../ui/RecommendationTable";

interface MobileTabProps {
  data: PageSpeedData | null;
  loading?: boolean;
  isEliteClient: boolean;
}

const MobileTab = ({ data, loading, isEliteClient }: MobileTabProps) => {
  
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

  const performanceScore = data.lighthouseResult.categories?.performance?.score || 0;

  // Key metrics
  const filteredData = extractDesktopData(data);
  const speedIndex = filteredData?.performance?.analytics["speed-index"];
  const totalBlockingTime = filteredData?.performance?.analytics["total-blocking-time"];
  const passedDiagnostics = filteredData?.performance?.diagnostics?.passed || [];
  const failedDiagnostics = filteredData?.performance?.diagnostics?.failed || [];

  console.log("Filtered Mobile Data:", filteredData);


  return (
    <div className=" mx-auto bg-white">
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className={`text-[52px] font-medium text-gray-900`}>
              {getPerformanceGrade(formatScore(performanceScore))}
            </div>
              <h1 className="text-lg font-semibold text-gray-900">Mobile Performance</h1>
              <p className="text-[#1F2F2F] text-sm max-w-xl text-center" >
                Evaluates the speed and functionality of your website on mobile devices, directly influencing user experience and conversion rates.
              </p>
              {!isEliteClient && <ImproveWebsiteButton />}
            
          </div>
        </div>
        <div className="w-full flex-1 md:flex justify-center">
        <div className="hidden md:block">
          <div className="w-32 h-64 bg-gray-200 rounded-lg relative overflow-hidden border-4 border-gray-800">
            {/* Phone frame top */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
            
            {/* Screenshot container */}
            <div className="absolute top-4 left-1 right-1 bottom-4 bg-white rounded-sm overflow-hidden">
              {data?.lighthouseResult?.audits['final-screenshot']['details']['data'] ? (
                <img 
                  src={data?.lighthouseResult?.audits['final-screenshot']['details']['data']}
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
      </div>

      {/* Key Metrics */}
      <div className="grid border border-gray-200 rounded p-2.5  grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Speed Index */}
        {speedIndex && (
          <div className="">
          <div className="flex gap-2">
            <div className="pt-4">
              <ScoreIcon score={speedIndex.score} />
            </div>
          <div>
              <h3 className="text-base text-[#333]">Speed Index</h3>
              <div className={`text-2xl   ${getScoreColor(speedIndex.score)}`}>
                {speedIndex.displayValue}
              </div>
          </div>
        </div>
      </div>
        )}

        {/* Total Blocking Time */}
         {totalBlockingTime && (
          <div className="">
          <div className="flex gap-2">
            <div className="pt-4">
              <ScoreIcon score={totalBlockingTime.score} />
            </div>
          <div>
              <h3 className="text-base text-[#333]">Total Blocking Time</h3>
              <div className={`text-2xl   ${getScoreColor(totalBlockingTime.score)}`}>
                {totalBlockingTime.displayValue}
              </div>
          </div>
        </div>
      </div>
        )}
      </div>

      <div className="space-y-4">       
       
    {/* Passed Diagnostics Section */}
      {passedDiagnostics.length > 0 && (
        <div className="space-y-4 mb-8 border-[#799F92] border rounded-lg overflow-hidden ">
          {passedDiagnostics.map((diagnostic, index) => (
             <div key={index} className={"bg-white p-4 " + (index !== 0 && "border-gray-200 border-t")}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{diagnostic.title}</h3>
                    <span className="px-2 py-1 rounded-lg text-base bg-[#799F92] text-white">
                      Excellent
                    </span>
                  </div>
                  <p className="text-sm text-[#1F2F2F] max-w-xl">
                    {diagnostic.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Failed Diagnostics Section */}
      {failedDiagnostics.length > 0 && (
        <div className="space-y-4 mb-8 border-[#fa3] border rounded-lg overflow-hidden ">
          {failedDiagnostics.map((diagnostic, index) => (
            <div key={index} className={"bg-white p-4 " + (index !== 0 && "border-gray-200 border-t")}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{diagnostic.title}</h3>
                    <span className="px-2 py-1 rounded-lg text-base bg-[#fa3] text-white">
                      Needs Improvement
                    </span>
                  </div>
                  <p className="text-sm text-[#1F2F2F] max-w-xl">
                    {diagnostic.description}
                  </p>
                  
                  {/* Table for failed diagnostics with details */}
                   {diagnostic.recommended_details && diagnostic.recommended_details.items && (
                    <RecommendationTable diagnostic={diagnostic} />
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
};

export default MobileTab;